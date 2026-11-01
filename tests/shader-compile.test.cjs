const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const compiler = require('@webgpu/glslang')();
const filename = path.resolve('src/components/farm/scene/SketchEffect.ts');
const source = new Module(filename, module);
source.filename = filename;
source.paths = Module._nodeModulePaths(path.dirname(filename));
source._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, filename);
const { sketchFragment } = source.exports;

test('the actual sketch fragment passes GLSL semantic compilation', () => {
  // glslang emits SPIR-V, so adapt only the host interface/version to ES 3.1.
  // The effect function itself is compiled unchanged: duplicate local names,
  // undefined identifiers, invalid types and syntax must fail this check.
  const shader = `#version 310 es
precision highp float;
#define texture2D texture
layout(set=0,binding=0) uniform sampler2D inputBuffer;
layout(set=0,binding=1) uniform Parameters { float uMix; vec2 resolution; };
layout(location=0) in vec2 vUv;
layout(location=0) out vec4 fragColor;
${sketchFragment.replace('uniform float uMix;', '')}
void main() { mainImage(texture(inputBuffer, vUv), vUv, fragColor); }
`;
  const binary = compiler.compileGLSL(shader, 'fragment');
  assert.ok(binary.length > 0);
  assert.equal(binary[0], 0x07230203, 'compiler produced valid SPIR-V magic');
});


test('only identified compositor shader failures use plain 3D recovery', () => {
  const routingPath = path.resolve('src/components/farm/scene/shader-failure.ts');
  const routing = new Module(routingPath, module);
  routing._compile(ts.transpileModule(fs.readFileSync(routingPath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS }
  }).outputText, routingPath);
  const { routeShaderFailure } = routing.exports;
  const results = [];
  const handlers = { effects: () => results.push('effects'), scene: () => results.push('scene') };
  for (const source of [
    '#version 300 es\n#define SHADER_NAME EffectMaterial\nvoid main() {}',
    '#define SHADER_NAME ShaderMaterial\nvoid main() {}',
    '#define SHADER_NAME MeshStandardMaterial',
    '// EffectMaterial appears in a comment, not the generated material identity',
    null,
  ]) routeShaderFailure(source, handlers);
  assert.deepEqual(results, ['effects', 'scene', 'scene', 'scene', 'scene']);
});


test('weather sky fragment passes actual GLSL semantic compilation',()=>{
  const source=fs.readFileSync('src/components/farm/scene/FarmCanvas.tsx','utf8');
  const fragment=source.match(/fragmentShader=\{`([\s\S]*?)`\}/)[1]
    .replace('varying vec3 vDir;', 'layout(location=0) in vec3 vDir;')
    .replace(/uniform float u(Overcast|Night|Sunset);/g,'')
    .replace('gl_FragColor','fragColor');
  const binary=compiler.compileGLSL(`#version 310 es
precision highp float;
layout(set=0,binding=0) uniform Weather {float uOvercast;float uNight;float uSunset;};
layout(location=0) out vec4 fragColor;
${fragment}`, 'fragment');
  assert.equal(binary[0],0x07230203);
});
