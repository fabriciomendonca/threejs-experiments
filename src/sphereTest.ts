import * as THREE from "three";
import fragmentShader from "./shaders/secondStudy.frag.glsl";
import vertexShader from "./shaders/sphereTest.vert.glsl";

export const sphereTest = () => {
  const geometry = new THREE.SphereGeometry(5, 64, 64);
  // const geometry = new THREE.PlaneGeometry(10, 10, 800, 600);
  // const geometry = new THREE.TorusGeometry(6, 2, 100, 200);
  // const geometry = new THREE.TorusKnotGeometry(6, 2, 300, 100);
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader,
    blending: THREE.AdditiveBlending,
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(0, 0, 0);

  const internalTick = (time: number) => {
    material.uniforms.uTime = { value: time / 1000 };
    let position = -Math.abs(Math.sin(time / 5000) * 10);
    window.requestAnimationFrame(internalTick);

    sphere.position.z = position;
  };

  return {
    mesh: sphere,
    material,
    geometry,

    startTick() {
      internalTick(0);
    },
  };
};
