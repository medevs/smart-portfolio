const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  return resolve.call(
    this,
    request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request,
    parent,
    ...rest,
  );
};
for (const extension of ['.ts', '.tsx']) {
  Module._extensions[extension] = function (module, filename) {
    module._compile(
      ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
          resolveJsonModule: true,
        },
        fileName: filename,
      }).outputText,
      filename,
    );
  };
}
Module._extensions['.css'] = () => {};
