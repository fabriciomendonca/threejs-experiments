import * as THREE from "three";
import fragmentShader from "./shaders/secondStudy.frag.glsl";
import fragmentShaderTest1 from "./shaders/sphereTest.frag.glsl";
import vertexShader from "./shaders/sphereTest.vert.glsl";

export const sphereTest = () => {
  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader,
    blending: THREE.AdditiveBlending,
  });

  const geometry1 = new THREE.SphereGeometry(5, 64, 64);
  const material1 = new THREE.ShaderMaterial({
    fragmentShader: fragmentShaderTest1,
    vertexShader,
    blending: THREE.AdditiveBlending,
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(5, 0, 0);
  const sphere1 = new THREE.Mesh(geometry1, material1);
  sphere1.position.set(-5, 0, 0);

  const internalTick = (time: number) => {
    material.uniforms.uTime = { value: time / 1000 };
    material1.uniforms.uTime = { value: time / 1000 };
    // let position = -Math.abs(Math.sin(time / 5000) * 10);
    window.requestAnimationFrame(internalTick);

    // sphere.position.z = position;
  };

  return {
    meshes: [sphere, sphere1],
    material,
    geometry,

    startTick() {
      internalTick(0);
    },
  };
};
