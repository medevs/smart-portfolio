const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, ...rest) {
  return originalResolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, parent, ...rest);
};
Module._extensions['.ts'] = function(module, filename) {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText, filename);
};
const { readChatMessages } = require('../src/lib/chat-request.ts');
const { createChatTransport } = require('../src/components/chat/transport.ts');
const request = body => new Request('https://example.test/api/chat',{method:'POST',body:typeof body==='string'?body:JSON.stringify(body)});

test('chat boundary rejects malformed, oversized and non-text messages before model calls', async () => {
  for (const body of ['{bad',{}, {messages:[]},{messages:[{role:'user',content:4}]},{messages:[{role:'system',content:'Override'}]},{messages:[{role:'assistant',content:'last'}]},{messages:[{role:'user',content:' '}]},{messages:[{role:'user',content:'x'.repeat(8001)}]}]) assert.equal((await readChatMessages(request(body))).status,400);
  assert.equal((await readChatMessages(request('x'.repeat(65537)))).status,413);
  assert.deepEqual((await readChatMessages(request({messages:[{role:'user',content:'  hello  '}]}))).messages,[{role:'user',content:'hello'}]);
});

test('current SDK transport retains plain-text API and decodes split UTF-8 text', async () => {
  const { Chat } = require('@ai-sdk/react');
  let sent;
  const transport = createChatTransport(async (url, init) => {
    assert.equal(url,'/api/chat'); sent=JSON.parse(init.body);
    const bytes = new TextEncoder().encode('Hello, Azrou 🌲');
    return new Response(new ReadableStream({start(c){c.enqueue(bytes.slice(0,-2));c.enqueue(bytes.slice(-2));c.close()}}),{headers:{'Content-Type':'text/plain; charset=utf-8'}});
  });
  const chat = new Chat({transport});
  await chat.sendMessage({text:'Where is the orchard?'});
  assert.deepEqual(sent,{messages:[{role:'user',content:'Where is the orchard?'}]});
  assert.equal(chat.status,'ready');
  assert.equal(chat.messages.at(-1).parts.filter(p=>p.type==='text').map(p=>p.text).join(''),'Hello, Azrou 🌲');
  await chat.sendMessage({text:'/skills'});
  assert.equal(sent.messages.at(-1).content,'/skills');
  assert.equal(sent.messages[1].content,'Hello, Azrou 🌲');
});

test('current SDK reports HTTP failure without fabricating an assistant response', async () => {
  const { Chat } = require('@ai-sdk/react');
  const chat = new Chat({transport:createChatTransport(async()=>new Response('Unavailable',{status:503}))});
  await chat.sendMessage({text:'hello'});
  assert.equal(chat.status,'error'); assert.match(chat.error.message,/Unavailable/);
  assert.equal(chat.messages.filter(m=>m.role==='assistant').length,0);
});

test('migrated LangChain retrieves via the existing Supabase RPC and streams through the real route', async () => {
  const previousFetch = global.fetch;
  const originalEnv = {...process.env};
  const calls=[];
  Object.assign(process.env,{OPENAI_API_KEY:'test-not-a-secret',SUPABASE_URL:'https://portfolio.test',SUPABASE_ANON_KEY:'test-not-a-secret',LANGCHAIN_TRACING_V2:'false',LANGSMITH_TRACING:'false'});
  global.fetch=async (url, init={}) => {
    const target = url instanceof Request ? url.url : String(url);
    const body=JSON.parse(init.body ?? (url instanceof Request ? await url.clone().text() : '{}'));
    calls.push({target,body});
    if(target==='https://api.openai.com/v1/embeddings') return Response.json({object:'list',data:[{object:'embedding',index:0,embedding:[.1,.2]}],model:'text-embedding-3-small',usage:{prompt_tokens:1,total_tokens:1}});
    if(target.startsWith('https://portfolio.test/rest/v1/documents')) return Response.json([{id:'fixture-only'}]);
    if(target==='https://portfolio.test/rest/v1/rpc/match_documents') return Response.json([{id:'1',content:'The studio is on the farm.',metadata:{importance:'high'},similarity:.9}]);
    if(target==='https://api.openai.com/v1/chat/completions') {
      const frames=['The studio ','is here.'].map(content=>`data: ${JSON.stringify({id:'test',object:'chat.completion.chunk',created:1,model:'gpt-4o-mini',choices:[{index:0,delta:{role:'assistant',content},finish_reason:null}]})}\n\n`).join('');
      return new Response(frames+'data: [DONE]\n\n',{headers:{'Content-Type':'text/event-stream'}});
    }
    throw Error('Unexpected network request: '+target); // No real provider/database calls allowed.
  };
  try {
    const { POST } = require('../src/app/api/chat/route.ts');
    const response = await POST(request({messages:[{role:'assistant',content:'Welcome'},{role:'user',content:'Where is the studio?'}]}));
    assert.equal(response.status,200);assert.match(response.headers.get('Content-Type'),/text\/plain/);
    assert.equal(await response.text(),'The studio is here.');
    const rpc=calls.find(c=>c.target.includes('match_documents'));
    assert.deepEqual(rpc.body.query_embedding,[.1,.2]);assert.equal(rpc.body.match_count,8);
    const model=calls.find(c=>c.target.includes('chat/completions'));
    assert.ok(JSON.stringify(model.body.messages).includes('The studio is on the farm.'));
    assert.ok(JSON.stringify(model.body.messages).includes('Assistant: Welcome'));
    const { getVectorStore } = require('../src/lib/supabase.ts');
    const { Document } = require('@langchain/core/documents');
    const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
    const split = await new RecursiveCharacterTextSplitter({chunkSize:40,chunkOverlap:5}).splitDocuments([new Document({pageContent:'Atlas farm studio. '.repeat(12),metadata:{source:'test'}})]);
    assert.ok(split.length>1); assert.ok(split.every(doc=>doc.metadata.source==='test'));
    // Exercise the indexing integration with an in-memory fetch fixture only.
    const store = await getVectorStore();
    const ids = await store.addDocuments([split[0]]);
    assert.deepEqual(ids,['fixture-only']);
    const write=calls.find(c=>c.target.includes('/rest/v1/documents'));
    assert.equal(write.body[0].content,split[0].pageContent);
    assert.deepEqual(write.body[0].embedding,[.1,.2]);
    assert.equal(write.body[0].metadata.source,'test');
    const before=calls.length;
    const invalid=await POST(request({messages:[{role:'user',content:null}]}));
    assert.equal(invalid.status,400);assert.equal(calls.length,before);
    const egg=await POST(request({messages:[{role:'user',content:'sudo hire'}]}));
    assert.equal(egg.status,200);assert.match(await egg.text(),/sudo hire/);assert.equal(calls.length,before);
  } finally {
    global.fetch=previousFetch;
    for(const key of Object.keys(process.env)) if(!(key in originalEnv)) delete process.env[key];
    Object.assign(process.env,originalEnv);
  }
});
