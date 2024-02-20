import * as THREE from "three";
import secondStudyFragmentShader from "./shaders/secondStudy.frag.glsl";
import displacementTest1Shader from "./shaders/displacementTest1.vert.glsl";
import displacementTest2SVertex from "./shaders/displacementTest2.vert.glsl";
import displacementTest2Fragment from "./shaders/displacementTest2.frag.glsl";
import displacementTest3SVertex from "./shaders/displacementTest3.vert.glsl";
import displacementTest3Fragment from "./shaders/displacementTest3.frag.glsl";

export const displacementTest = () => {
  const createInternalTicker = (material: THREE.ShaderMaterial) => {
    const tick = (time = 0) => {
      material.uniforms.uTime = { value: time / 1000 };
      window.requestAnimationFrame(tick);
    };

    tick();
  };

  return {
    test1() {
      const geometry = new THREE.SphereGeometry(2, 128, 128);

      const material = new THREE.ShaderMaterial({
        fragmentShader: secondStudyFragmentShader,
        vertexShader: displacementTest1Shader,
        side: THREE.DoubleSide,
      });
      // material.wireframe = true;

      const mesh = new THREE.Mesh(geometry, material);

      createInternalTicker(material);

      return {
        geometry,
        material,
        meshes: [mesh],
      };
    },

    test2() {
      // const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
      // const geometry = new THREE.BoxGeometry(10, 10, 10, 128, 128, 128);
      const geometry = new THREE.SphereGeometry(5, 128, 128);
      const material = new THREE.ShaderMaterial({
        fragmentShader: displacementTest2Fragment,
        vertexShader: displacementTest2SVertex,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);

      createInternalTicker(material);

      return {
        meshes: [mesh],
      };
    },

    test3() {
      // const geometry = new THREE.PlaneGeometry(10, 10, 16, 16);
      // const geometry = new THREE.BoxGeometry(10, 10, 10, 128, 128, 128);
      const geometry = new THREE.SphereGeometry(5, 1024, 1024);
      const material = new THREE.ShaderMaterial({
        fragmentShader: displacementTest3Fragment,
        vertexShader: displacementTest3SVertex,
        side: THREE.DoubleSide,
        // wireframe: true,
      });

      const mesh = new THREE.Mesh(geometry, material);

      createInternalTicker(material);

      return {
        meshes: [mesh],
      };
    },
  };
};
