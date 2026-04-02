import * as THREE from "three";
import gsap from "gsap";
import * as dat from "dat.gui";

import vertexShader from "./shaders/fireworks5.vert.glsl";
import vertexShaderMovingUp from "./shaders/fireworks3MovingUp.vert.glsl";
import fragmentShader from "./shaders/fireworks5.frag.glsl";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

export const fireworks5 = () => {
  const GUI = new dat.GUI({ width: 340 });
  return {
    render(scene: THREE.Scene, sizes: any) {
      let pixelRatio = Math.min(window.devicePixelRatio, 2);
      const resolution = new THREE.Vector2(
        window.innerWidth * pixelRatio,
        window.innerHeight * pixelRatio
      );

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/gltf/");
      const modelLoader = new GLTFLoader();
      modelLoader.setDRACOLoader(dracoLoader);
      const textureLoader = new THREE.TextureLoader();

      const fireworkTexture = textureLoader.load(
        "textures/particles/muzzle_02.png"
      );

      const getModelPointsBufferCombined = (model: any) => {
        let count = 0;
        model.traverse((child: any) => {
          if (child.isMesh) {
            const size = child.geometry.attributes.position.array.length;
            count += size;
          }
        });

        const combined = new Float32Array(count);
        let offset = 0;
        model.traverse((child: any) => {
          if (child.isMesh) {
            const buffer = child.geometry.attributes.position;

            combined.set(buffer.array, offset);
            offset += buffer.array.length;
          }
        });

        const newPosition = new THREE.BufferAttribute(combined, 3);

        return newPosition;
      };

      let guitarPoints: THREE.BufferAttribute;
      modelLoader.load("models/guitarra_vermelha_compressed.glb", (data) => {
        const model = data.scene;

        guitarPoints = getModelPointsBufferCombined(model);
      });

      const createFirework = (
        countToRemove: number,
        position: THREE.Vector3,
        size: number,
        radius: number,
        color: THREE.Color
      ) => {
        const count = guitarPoints.count;
        // const positionsArray = new Float32Array(count * 3);
        const sizesArray = new Float32Array(count);
        const timeMultipliersArray = new Float32Array(count);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", guitarPoints.clone());

        for (let i = 0; i < count; i++) {
          sizesArray[i] = Math.random();
          timeMultipliersArray[i] = 1 + Math.random();
        }

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
        firework.scale.setScalar(2);
        // firework.rotation.z = (-45 * Math.PI) / 180;

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
        const size = 0.1;
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
