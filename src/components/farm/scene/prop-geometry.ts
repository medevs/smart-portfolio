import * as THREE from "three";

/** Normalize scanned geometry around a ground-contact anchor without changing the cached source. */
export function groundedModel(source: THREE.Object3D, height: number) {
  const clone = source.clone(true);
  clone.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(clone),
    size = box.getSize(new THREE.Vector3());
  const centre = box.getCenter(new THREE.Vector3());
  const root = new THREE.Group();
  clone.position.sub(new THREE.Vector3(centre.x, box.min.y, centre.z));
  root.add(clone);
  root.scale.setScalar(height / Math.max(size.y, 0.0001));
  clone.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return root;
}
