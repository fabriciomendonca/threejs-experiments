import * as THREE from "three";
import test4Vertex from "./shaders/particlesTest.vert.glsl";
import test4Fragment from "./shaders/particlesTest.frag.glsl";
import test3Fragment from "./shaders/particlesTest3.frag.glsl";
import test3Vertex from "./shaders/particlesTest3.vert.glsl";
import { gsap } from "gsap";

export const particlesTests = () => {
  return {
    test1() {
      const geometry = new THREE.BufferGeometry();

      const material = new THREE.PointsMaterial({
        color: 0xf838ab,
        size: 0.1,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const numParticles = 20000;
      const positions = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3;
        const rand = Math.pow(Math.random() - 0.5, 3);
        const x = Math.sin(rand * 90 * Math.PI) * 10;
        const y = Math.cos(rand * 45 * Math.PI * 10);
        const z = Math.tan(rand * 270 * Math.PI) * 10;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particles = new THREE.Points(geometry, material);

      const internalTick = (time = 0) => {
        for (let i = 0; i < numParticles; i++) {
          const i3 = i * 3;
          const x = geometry.attributes.position.array[i3];
          positions[i3 + 1] += Math.sin(time / 1000 + x) / 30;
        }

        geometry.attributes.position.needsUpdate = true;
        window.requestAnimationFrame(internalTick);
      };

      internalTick();

      return {
        particles,
      };
    },

    test2() {
      const geometry = new THREE.BufferGeometry();

      const material = new THREE.PointsMaterial({
        size: 0.02,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      const numParticles = 100000;
      const positions = new Float32Array(numParticles * 3);
      const colors = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3;
        const rand = Math.pow(Math.random() - 0.5, 3);
        const x = Math.sin(i) * rand * 50;
        const y = Math.cos(i) * rand * 50;
        const z = rand * 50;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        colors[i3] = 0.06 / Math.random();
        colors[i3 + 1] = 0.01 / Math.random();
        colors[i3 + 2] = 0.08 / Math.random();
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const particles = new THREE.Points(geometry, material);
      particles.rotation.x = -Math.PI / 2;

      const initialPositions = [...positions];
      const internalTick = (time = 0) => {
        for (let i = 0; i < numParticles; i++) {
          const i3 = i * 3;
          const x = initialPositions[i3];
          const y = initialPositions[i3 + 1];
          const z = initialPositions[i3 + 2];

          positions[i3] += Math.cos(time / 1000 + y) / 150;
          positions[i3 + 1] += Math.sin(time / 1000 + z) / 200;
          positions[i3 + 2] += Math.cos(time / 1000 + x) / 100;
        }

        geometry.attributes.position.needsUpdate = true;
        window.requestAnimationFrame(internalTick);
      };

      internalTick();

      return {
        particles,
      };
    },

    test3() {
      const geometry = new THREE.BufferGeometry();

      const material = new THREE.ShaderMaterial({
        // color: 0xf838ab,
        fragmentShader: test3Fragment,
        vertexShader: test3Vertex,
        depthWrite: false,
        // blending: THREE.MultiplyBlending,
        vertexColors: true,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 16 * Math.min(window.devicePixelRatio, 2) },
        },
      });

      const numParticles = 50000;
      const positions = new Float32Array(numParticles * 3);
      const colors = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3;
        const rand = Math.pow(Math.random() - 0.5, 3);
        const x = Math.random() * 60 - 30;
        const y = Math.random() * 60 - 30;
        const z = Math.random() * 60 - 30;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        colors[i3] = Math.random() / Math.random();
        colors[i3 + 1] = Math.random() / Math.random();
        colors[i3 + 2] = Math.random() / Math.random();
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const particles = new THREE.Points(geometry, material);

      const internalTick = (time = 0) => {
        for (let i = 0; i < numParticles; i++) {
          const i3 = i * 3;
          // const x = Math.random() * 60 - 30;
          // const y = Math.random() * 60 - 30;
          // const z = Math.random() * 60 - 30;
          // positions[i3] = x;
          // positions[i3 + 1] = y;
          // positions[i3 + 2] = z;
        }

        geometry.attributes.position.needsUpdate = true;
        material.uniforms.uTime.value = time / 1000;
        window.requestAnimationFrame(internalTick);
      };

      internalTick();

      return {
        particles,
      };
    },

    test4() {
      const geometry = new THREE.BufferGeometry();

      const material = new THREE.ShaderMaterial({
        // color: 0xf838ab,
        // size: 0.1,
        // sizeAttenuation: true,
        fragmentShader: test4Fragment,
        vertexShader: test4Vertex,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 32 * Math.min(window.devicePixelRatio, 2) },
        },
      });

      const numParticles = 50000;
      const positions = new Float32Array(numParticles * 3);
      const colors = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const i3 = i * 3;
        const rand = Math.pow(Math.random() - 0.5, 3);
        const x = Math.sin(rand * 90 * Math.PI) * 10;
        const y = Math.cos(rand * 45 * Math.PI * 10);
        const z = Math.tan(rand * 270 * Math.PI) * 10;
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        colors[i3] = 0.2 / Math.random();
        colors[i3 + 1] = 0.2 / Math.random();
        colors[i3 + 2] = 0.1 / Math.random();
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const particles = new THREE.Points(geometry, material);

      const internalTick = (time = 0) => {
        // for (let i = 0; i < numParticles; i++) {
        //   const i3 = i * 3;
        //   const x = geometry.attributes.position.array[i3];
        //   positions[i3 + 1] += Math.sin(time / 1000 + x) / 30;
        // }
        material.uniforms.uTime.value = time / 1000;
        window.requestAnimationFrame(internalTick);
      };

      internalTick();

      return {
        particles,
      };
    },

    test5() {
      const geometry = new THREE.TorusGeometry(5, 1, 16, 100);
      const material = new THREE.PointsMaterial({
        size: 0.05,
        sizeAttenuation: true,
        depthWrite: false,
        vertexColors: true,
      });

      const particles = new THREE.Points(geometry, material);

      const size = geometry.attributes.position.array.length;
      const originalPositions = [...geometry.attributes.position.array];
      const finalPositions = originalPositions.map((p) => {
        let rand = Math.random() * 30 - 15;
        return p + rand;
      });

      const colors = new Float32Array(size);
      for (let i = 0; i < size; i++) {
        const i3 = i * 3;

        colors[i3] = 0.2 / Math.random();
        colors[i3 + 1] = 0.1 / Math.random();
        colors[i3 + 2] = 0.07 / Math.random();

        const animation = {
          x: originalPositions[i3],
          y: originalPositions[i3 + 1],
          z: originalPositions[i3 + 2],
        };

        gsap.to(animation, {
          x: finalPositions[i3],
          y: finalPositions[i3 + 1],
          z: finalPositions[i3 + 2],
          duration: 2,
          delay: 2,
          repeat: -1,
          repeatDelay: 4,
          ease: "expo.out",
          onUpdate: ({ x, y, z }) => {
            geometry.attributes.position.array[i3] = x;
            geometry.attributes.position.array[i3 + 1] = y;
            geometry.attributes.position.array[i3 + 2] = z;
            geometry.attributes.position.needsUpdate = true;
          },
          onUpdateParams: [animation],
        });
        gsap.to(animation, {
          x: originalPositions[i3],
          y: originalPositions[i3 + 1],
          z: originalPositions[i3 + 2],
          duration: 2,
          delay: 4,
          repeat: -1,
          repeatDelay: 4,
          ease: "expo.in",
          onUpdate: ({ x, y, z }) => {
            geometry.attributes.position.array[i3] = x;
            geometry.attributes.position.array[i3 + 1] = y;
            geometry.attributes.position.array[i3 + 2] = z;
            geometry.attributes.position.needsUpdate = true;
          },
          onUpdateParams: [animation],
        });
      }

      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const internalTick = () => {
        window.requestAnimationFrame(internalTick);
      };
      internalTick();

      return {
        particles,
      };
    },
  };
};
