import * as THREE from "three";
import gsap from "gsap";

import vertexShader from "./shaders/fireworks6/vertex.glsl";
import fragmentShader from "./shaders/fireworks6/fragment.glsl";

export const fireworks6 = () => {
  return {
    render(scene: THREE.Scene) {
      const textureLoader = new THREE.TextureLoader();

      const muzzleTexture = textureLoader.load(
        "textures/particles/magic_05.png"
      );
      const createTrail = () => {
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.ShaderMaterial({
          blending: THREE.AdditiveBlending,
          fragmentShader,
          vertexShader,
          uniforms: {
            uColor: new THREE.Uniform(
              new THREE.Color().setHSL(Math.random(), 0.9, 0.5)
            ),
            uTexture: new THREE.Uniform(muzzleTexture),
          },
          depthTest: false,
        });
        const trailPoints = new THREE.Points(trailGeometry, trailMaterial);

        const size = 50;
        const animationProps = {
          size,
        };

        const positionsArray = new Float32Array(size * 3);
        for (let i = 0; i < size; i++) {
          const i3 = i * 3;

          positionsArray[i3] = (Math.random() - 0.5) * 0.1;
          positionsArray[i3 + 1] = (Math.random() - 0.5) * 10;
          positionsArray[i3 + 2] = (Math.random() - 0.5) * 0.1;
        }

        trailGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positionsArray, 3)
        );

        scene.add(trailPoints);
      };

      createTrail();
    },
  };
};
