import * as THREE from "three";

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
        // color: 0xf838ab,
        size: 0.05,
        sizeAttenuation: true,
        depthWrite: false,
        // blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      const numParticles = 50000;
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
        for (let i = 0; i < numParticles; i++) {
          const i3 = i * 3;
          const x = geometry.attributes.position.array[i3];
          const z = geometry.attributes.position.array[i3 + 2];

          positions[i3] += Math.sin(time / 1000 + z) / 100;
          positions[i3 + 1] += Math.sin(time / 1000 + x) / 100;
        }

        geometry.attributes.position.needsUpdate = true;
        window.requestAnimationFrame(internalTick);
      };

      internalTick();

      return {
        particles,
      };
    },
  };
};
