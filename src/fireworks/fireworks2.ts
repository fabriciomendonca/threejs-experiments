import * as THREE from "three";
import gsap from "gsap";
import * as dat from "dat.gui";

import vertexShader from "./shaders/fireworks2.vert.glsl";
import fragmentShader from "./shaders/fireworks2.frag.glsl";

export const fireworks2 = () => {
  const GUI = new dat.GUI({ width: 340 });
  return {
    render(scene: THREE.Scene, sizes: any) {
      let pixelRatio = Math.min(window.devicePixelRatio, 2);
      const resolution = new THREE.Vector2(
        window.innerWidth * pixelRatio,
        window.innerHeight * pixelRatio
      );

      const textureLoader = new THREE.TextureLoader();

      const fireworkTexture = textureLoader.load(
        "textures/particles/magic_05.png"
      );

      const createFirework = (
        count: number,
        position: THREE.Vector3,
        size: number,
        radius: number,
        color: THREE.Color
      ) => {
        const positionsArray = new Float32Array(count * 3);
        const sizesArray = new Float32Array(count);
        const timeMultipliersArray = new Float32Array(count);

        for (let i = 0; i < count; i++) {
          const i3 = i * 3;

          const spherical = new THREE.Spherical(
            radius * (0.75 + Math.random() * 0.25),
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2
          );
          const sphericalPosition = new THREE.Vector3().setFromSpherical(
            spherical
          );

          positionsArray[i3] = sphericalPosition.x;
          positionsArray[i3 + 1] = sphericalPosition.y;
          positionsArray[i3 + 2] = sphericalPosition.z;

          sizesArray[i] = Math.random();
          timeMultipliersArray[i] = 1 + Math.random();
        }

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positionsArray, 3)
        );
        geometry.setAttribute(
          "aSize",
          new THREE.BufferAttribute(sizesArray, 1)
        );
        geometry.setAttribute(
          "aTimeMultiplier",
          new THREE.BufferAttribute(timeMultipliersArray, 1)
        );

        const material = new THREE.ShaderMaterial({
          blending: THREE.AdditiveBlending,
          fragmentShader,
          vertexShader,
          uniforms: {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(resolution),
            uTexture: new THREE.Uniform(fireworkTexture),
            uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0),
          },
          transparent: true,
          depthWrite: false,
        });

        const firework = new THREE.Points(geometry, material);
        firework.position.copy(position);

        const destroy = () => {
          geometry.dispose();
          material.dispose();
          scene.remove(firework);
        };

        gsap.to(material.uniforms.uProgress, {
          value: 1,
          duration: 4,
          ease: "linear",
          onComplete: destroy,
        });

        scene.add(firework);
      };

      const createRandomFirework = () => {
        const count = Math.round(400 + Math.random() * 2000);
        const position = new THREE.Vector3(
          Math.random() * 20 - 10,
          3 + Math.random() * 5,
          -1 - Math.random() * 10 - 5
        );
        const size = 0.5 + Math.random() * 2;
        const radius = 3 + Math.random() * 12;
        const color = new THREE.Color().setHSL(Math.random(), 1, 0.1);

        createFirework(count, position, size, radius, color);
      };

      window.addEventListener("click", () => {
        createRandomFirework();
      });

      const onResize = () => {
        pixelRatio = Math.min(window.devicePixelRatio, 2);
        resolution.set(
          window.innerWidth * pixelRatio,
          window.innerHeight * pixelRatio
        );
      };
      window.addEventListener("resize", onResize);
    },
  };
};
