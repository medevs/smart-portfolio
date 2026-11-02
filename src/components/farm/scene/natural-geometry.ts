import * as THREE from "three";

/** Stable shapes let a reference review compare like with like after a reload. */
export function randomSeed(seed: number) {
  let state = seed >>> 0;
  return () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
}
export function landNoise(x: number, z: number) {
  const hash = (a: number, b: number) => { const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n); };
  const ix = Math.floor(x), iz = Math.floor(z), fx = x - ix, fz = z - iz;
  const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix, iz), hash(ix + 1, iz), u), THREE.MathUtils.lerp(hash(ix, iz + 1), hash(ix + 1, iz + 1), u), v);
}

class MeshBuilder {
  positions: number[] = []; colors: number[] = [];
  triangle(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, color: THREE.Color) {
    this.positions.push(...a.toArray(), ...b.toArray(), ...c.toArray());
    for (let i = 0; i < 3; i++) this.colors.push(color.r, color.g, color.b);
  }
  branch(a: THREE.Vector3, b: THREE.Vector3, radius: number, color: THREE.Color, endRadius = radius * .35) {
    const direction = b.clone().sub(a).normalize(), u = new THREE.Vector3(0, 1, .03).cross(direction).normalize(), v = direction.clone().cross(u);
    for (let i = 0; i < 6; i++) {
      const radial = (angle: number, scale: number) => u.clone().multiplyScalar(Math.cos(angle) * scale).addScaledVector(v, Math.sin(angle) * scale);
      const p = i / 6 * Math.PI * 2, q = (i + 1) / 6 * Math.PI * 2;
      const p0 = a.clone().add(radial(p, radius)), p1 = a.clone().add(radial(q, radius));
      const p2 = b.clone().add(radial(q, endRadius)), p3 = b.clone().add(radial(p, endRadius));
      this.triangle(p0, p1, p2, color); this.triangle(p0, p2, p3, color);
    }
  }
  leaf(center: THREE.Vector3, direction: THREE.Vector3, length: number, width: number, color: THREE.Color) {
    const across = new THREE.Vector3(.13, 1, .07).cross(direction).normalize().multiplyScalar(width);
    const tip = center.clone().addScaledVector(direction, length), base = center.clone().addScaledVector(direction, -length * .55);
    const ridge = center.clone().add(new THREE.Vector3(0, width * .22, 0));
    this.triangle(base, center.clone().add(across), ridge, color);
    this.triangle(center.clone().add(across), tip, ridge, color);
    this.triangle(tip, center.clone().sub(across), ridge, color);
    this.triangle(center.clone().sub(across), base, ridge, color);
  }
  finish() {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.positions, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(this.colors, 3));
    g.computeVertexNormals(); g.computeBoundingSphere(); return g;
  }
}

export function cedarGeometry(seed = 71, low = false) {
  const random = randomSeed(seed), wood = new MeshBuilder(), needles = new MeshBuilder();
  const bark = new THREE.Color("#655d4e"), green = new THREE.Color();
  const trunk = (y: number) => new THREE.Vector3(Math.sin(y * .9) * .055, y, Math.cos(y * 1.2) * .04);
  for (let i = 0; i < 9; i++) wood.branch(trunk(i * .66), trunk((i + 1) * .66), .23 * (1 - i / 10), bark, .23 * (1 - (i + 1) / 10));
  const tiers = low ? 7 : 9, twigs = low ? 2 : 3, sprays = low ? 4 : 5;
  for (let tier = 0; tier < tiers; tier++) {
    const y = 1.8 + tier / (tiers - 1) * 4, reach = 2.15 - tier / (tiers - 1) * 1.84, arms = low ? 5 : 8;
    for (let arm = 0; arm < arms; arm++) {
      const angle = arm / arms * Math.PI * 2 + tier * 1.83 + random() * .3;
      const length = reach * (.8 + random() * .3), origin = trunk(y);
      const tip = new THREE.Vector3(Math.cos(angle) * length, y + .12 - random() * .23, Math.sin(angle) * length);
      wood.branch(origin, tip, .055 * (1 - tier / 12), bark);
      for (let twig = 0; twig < twigs; twig++) {
        const t = .3 + twig / (twigs - 1) * .6, branch = origin.clone().lerp(tip, t);
        for (const side of [-1, 1]) {
          const heading = angle + side * .65;
          const end = branch.clone().add(new THREE.Vector3(Math.cos(heading) * .44, .08, Math.sin(heading) * .44));
          wood.branch(branch, end, .012, bark);
          for (let n = 0; n < sprays; n++) {
            const center = branch.clone().lerp(end, n / sprays);
            const direction = new THREE.Vector3(Math.cos(heading + (n % 2 ? -.85 : .85)), .15 + random() * .7, Math.sin(heading + (n % 2 ? -.85 : .85)));
            green.setHSL(.33 + random() * .045, .16 + random() * .16, .19 + random() * .15);
            needles.leaf(center, direction, .29 + random() * .14, .045, green);
          }
        }
      }
    }
  }
  return { wood: wood.finish(), foliage: needles.finish() };
}

export function appleGeometry(seed = 96, low = false) {
  const random = randomSeed(seed), wood = new MeshBuilder(), leaves = new MeshBuilder();
  const bark = new THREE.Color("#685d48"), color = new THREE.Color();
  wood.branch(new THREE.Vector3(0,0,0), new THREE.Vector3(.035,1.65,0), .15, bark);
  for (let i = 0; i < 7; i++) {
    const angle = i * 2.399, end = new THREE.Vector3(Math.cos(angle) * .83, 1.9 + random() * .4, Math.sin(angle) * .83);
    wood.branch(new THREE.Vector3(.02, .95 + i * .08, 0), end, .042, bark);
    wood.branch(end.clone().multiply(new THREE.Vector3(.6,1,.6)), end.clone().add(new THREE.Vector3(.08,.35,.06)), .017, bark);
  }
  for (let i = 0; i < (low ? 360 : 850); i++) {
    const angle = random() * Math.PI * 2, h = random() * 2 - 1, radius = Math.cbrt(.3 + random() * .7);
    const span = Math.sqrt(1 - h * h) * radius;
    const center = new THREE.Vector3(Math.cos(angle) * span * 1.04, 2.13 + h * radius * .77, Math.sin(angle) * span * 1.04);
    const direction = new THREE.Vector3(Math.cos(angle + random()), (random() - .5) * .8, Math.sin(angle + random())).normalize();
    color.setHSL(.22 + random() * .08, .21 + random() * .2, .19 + random() * .16);
    leaves.leaf(center, direction, .115, .048, color);
  }
  return { wood: wood.finish(), foliage: leaves.finish() };
}

/** Outer ground starts beyond the square physical yard; no hills under the avatar. */
export function foothillGeometry() {
  const g = new THREE.PlaneGeometry(240, 240, 100, 100); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position, colors = [], dry = new THREE.Color("#8d8970"), green = new THREE.Color("#6c7860");
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), edge = Math.max(Math.abs(x), Math.abs(z));
    const blend = THREE.MathUtils.smoothstep(edge, 46, 88);
    p.setY(i, -.18 + blend * (2.5 + landNoise(x * .045, z * .045) * 9 + landNoise(x * .14, z * .14) * 1.5));
    const c = dry.clone().lerp(green, landNoise(x * .055, z * .055)).multiplyScalar(.85 + landNoise(x * .3, z * .3) * .22);
    colors.push(c.r, c.g, c.b);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); g.computeVertexNormals(); g.computeBoundingSphere(); return g;
}
