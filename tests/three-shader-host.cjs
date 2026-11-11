const THREE = require('three');

/** Expand the installed Three chunks. Adapt only WebGL host I/O to glslang's SPIR-V interface. */
function compileThreeShader(compiler, source, stage, { directionalLights = 0 } = {}) {
  function expand(text) {
    return text.replace(/#include <(\w+)>/g, (_, name) => {
      if (!(name in THREE.ShaderChunk)) throw Error(`Unknown Three chunk ${name}`);
      return expand(THREE.ShaderChunk[name]);
    });
  }
  let shader = expand(source);
  const counts = {
    NUM_DIR_LIGHTS: directionalLights,
    NUM_POINT_LIGHTS: 0,
    NUM_SPOT_LIGHTS: 0,
    NUM_SPOT_LIGHT_MAPS: 0,
    NUM_SPOT_LIGHT_COORDS: 0,
    NUM_HEMI_LIGHTS: 0,
    NUM_RECT_AREA_LIGHTS: 0,
    NUM_DIR_LIGHT_SHADOWS: 0,
    NUM_POINT_LIGHT_SHADOWS: 0,
    NUM_SPOT_LIGHT_SHADOWS: 0,
    NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS: 0,
    NUM_LIGHT_PROBES: 0,
    NUM_CLIPPING_PLANES: 0,
    UNION_CLIPPING_PLANES: 0,
  };
  // WebGLProgram replaces these tokens before compile, rather than defining macros.
  for (const [name, count] of Object.entries(counts).sort((a, b) => b[0].length - a[0].length))
    shader = shader.replace(new RegExp(`\\b${name}\\b`, 'g'), String(count));
  const prefix =
    stage === 'vertex'
      ? `
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
uniform bool isOrthographic;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
`
      : `
uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
uniform bool isOrthographic;
layout(location=0) out vec4 pc_fragColor;
#define gl_FragColor pc_fragColor
vec4 linearToOutputTexel(vec4 value) {return value;}
`;
  shader = prefix + shader;
  let binding = 0,
    input = 0,
    output = 0;
  shader = shader.replace(
    /uniform\s+((?:(?:lowp|mediump|highp)\s+)?\w+)\s+(\w+)(\s*\[[^\]]+\])?\s*;/g,
    (_, type, name, array = '') => {
      const index = binding++;
      return /sampler/.test(type)
        ? `layout(set=0,binding=${index}) uniform ${type} ${name}${array};`
        : `layout(set=0,binding=${index}) uniform Host${index} { ${type} ${name}${array}; };`;
    },
  );
  shader = shader.replace(
    /\b(varying|attribute)\s+(\w+)\s+(\w+)(\s*\[[^\]]+\])?\s*;/g,
    (_, kind, type, name, array = '') => {
      const direction = kind === 'attribute' || stage === 'fragment' ? 'in' : 'out';
      const location = direction === 'in' ? input++ : output++;
      return `layout(location=${location}) ${direction} ${type} ${name}${array};`;
    },
  );
  // Vulkan glslang reserves average; rename the Three helper via a macro only in this host.
  return compiler.compileGLSL(
    `#version 310 es\nprecision highp float;\nprecision highp int;\n#define HIGH_PRECISION\n#define average threeAverage\n#define texture2D texture\n#define textureCube texture\n${shader}`,
    stage,
  );
}
module.exports = { compileThreeShader };
