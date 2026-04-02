import * as THREE from "three";
import gsap from "gsap";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export const fireworks = () => {
  return {
    render(scene: THREE.Scene) {
      const count = 1000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 4);
      const finalPositions = new Float32Array(count * 3);
      const inititalPositions = new Float32Array(count * 3);

      const color = new THREE.Color();
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const i4 = i * 4;

        const spherical = new THREE.Spherical(
          5,
          Math.random() * Math.PI,
          Math.random() * Math.PI * 2
        );
        const position = new THREE.Vector3().setFromSpherical(spherical);
        finalPositions[i3] = position.x;
        finalPositions[i3 + 1] = position.y;
        finalPositions[i3 + 2] = position.z;
        positions[i3] = (Math.random() - 0.5) * 0.1;
        positions[i3 + 1] = (Math.random() - 0.5) * 0.1;
        positions[i3 + 2] = (Math.random() - 0.5) * 0.1;
        inititalPositions[i3] = positions[i3];
        inititalPositions[i3 + 1] = positions[i3 + 1];
        inititalPositions[i3 + 2] = positions[i3 + 2];

        color.setHSL(Math.random(), 0.95, 0.75);
        colors[i4] = color.r;
        colors[i4 + 1] = color.g;
        colors[i4 + 2] = color.b;
        colors[i4 + 3] = 1;
      }

      const geometry = new THREE.BufferGeometry();

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      geometry.setAttribute(
        "colorWithAlpha",
        new THREE.BufferAttribute(colors, 4)
      );

      const material = new THREE.ShaderMaterial({
        blending: THREE.AdditiveBlending,
        fragmentShader,
        vertexShader,
        uniforms: {
          uTime: new THREE.Uniform(0),
        },
        transparent: true,
      });

      const points = new THREE.Points(geometry, material);

      scene.add(points);

      const progress = { value: 0 };
      gsap.to(points.position, { y: 5, duration: 1, ease: "power2.out" });
      progress.value = 0;
      gsap.to(progress, {
        value: 1,
        duration: 0.25,
        ease: "power3-in",
        delay: 0.8,
        onUpdate: () => {
          points.material.opacity = progress.value;
          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const i4 = i * 4;

            positions[i3] =
              progress.value * (finalPositions[i3] - positions[i3]) +
              (Math.random() - 0.5) * 0.5;
            positions[i3 + 1] =
              progress.value * (finalPositions[i3 + 1] - positions[i3 + 1]) +
              (Math.random() - 0.5) * 0.5;
            positions[i3 + 2] =
              progress.value * (finalPositions[i3 + 2] - positions[i3 + 2]) +
              (Math.random() - 0.5) * 0.5;
            geometry.setAttribute(
              "position",
              new THREE.BufferAttribute(positions, 3)
            );

            colors[i4 + 3] = progress.value;

            geometry.setAttribute(
              "position",
              new THREE.BufferAttribute(positions, 3)
            );
            geometry.setAttribute(
              "colorWithAlpha",
              new THREE.BufferAttribute(colors, 4)
            );
          }
        },
      });
      progress.value = 0;
      gsap.to(progress, {
        value: 1,
        duration: 1,
        ease: "power3-in",
        delay: 1.25,
        onUpdate: () => {
          points.material.opacity = progress.value;
          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const i4 = i * 4;

            // positions[i3] =
            //   progress.value * (finalPositions[i3] - positions[i3]) +
            //   (Math.random() - 0.5) * 0.5;
            // positions[i3 + 1] =
            //   progress.value * (finalPositions[i3 + 1] - positions[i3 + 1]) +
            //   (Math.random() - 0.5) * 0.5;
            // positions[i3 + 2] =
            //   progress.value * (finalPositions[i3 + 2] - positions[i3 + 2]) +
            //   (Math.random() - 0.5) * 0.5;
            // geometry.setAttribute(
            //   "position",
            //   new THREE.BufferAttribute(positions, 3)
            // );

            colors[i4 + 3] = 1 - progress.value;

            geometry.setAttribute(
              "position",
              new THREE.BufferAttribute(positions, 3)
            );
            geometry.setAttribute(
              "colorWithAlpha",
              new THREE.BufferAttribute(colors, 4)
            );
          }
        },
      });

      const tick = (time = 0) => {
        material.uniforms.uTime.value = time / 1000;
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.colorWithAlpha.needsUpdate = true;

        requestAnimationFrame(tick);
      };

      tick();
    },
  };
};
