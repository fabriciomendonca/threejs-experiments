import * as THREE from "three";
import gsap from "gsap";
import * as dat from "dat.gui";

import vertexShader from "./shaders/fireworks4.vert.glsl";
import vertexShaderMovingUp from "./shaders/fireworks3MovingUp.vert.glsl";
import fragmentShader from "./shaders/fireworks4.frag.glsl";

export const fireworks4 = () => {
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
        "textures/particles/muzzle_02.png"
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

          positionsArray[i3] = Math.pow(
            (Math.random() - 0.5) * Math.random() * 2 + (Math.random() - 0.5),
            3
          );
          positionsArray[i3 + 1] = Math.pow(
            (Math.random() - 0.5) * Math.random() * 2 + (Math.random() - 0.5),
            3
          );
          positionsArray[i3 + 2] = Math.pow(
            (Math.random() - 0.5) * Math.random() * 5 + (Math.random() - 0.5),
            3
          );

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
        const materialMovingUp = new THREE.ShaderMaterial({
          blending: THREE.AdditiveBlending,
          fragmentShader,
          vertexShader: vertexShaderMovingUp,
          uniforms: {
            uSize: new THREE.Uniform(0.1),
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

        const fireworkMovingUp = new THREE.Points(geometry, materialMovingUp);
        fireworkMovingUp.position.copy(position);
        fireworkMovingUp.position.y = 0;

        const destroy = () => {
          geometry.dispose();
          material.dispose();
          scene.remove(firework);
        };

        gsap.to(fireworkMovingUp.position, {
          y: position.y,
          duration: 1,
          ease: "power3.out",
          onComplete: () => {
            scene.remove(fireworkMovingUp);
          },
        });
        gsap.to(materialMovingUp.uniforms.uProgress, {
          value: 1,
          duration: 1,
          ease: "linear",
        });
        gsap.to(material.uniforms.uProgress, {
          value: 1,
          duration: 2,
          delay: 0.6,
          ease: "linear",
          onComplete: destroy,
        });

        scene.add(firework);
        scene.add(fireworkMovingUp);
      };

      const createRandomFirework = () => {
        const count = Math.round(50 + Math.random() * 100);
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
