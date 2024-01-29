import * as THREE from 'three';
import fragmentShader from './shaders/secondStudy.frag.glsl';
import displacementTestShader from './shaders/displacementTest.vert.glsl';

export const displacementTest = () => {
    // const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
    const geometry = new THREE.SphereGeometry(5, 128, 128);
    const material = new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader: displacementTestShader,
    });
    // material.wireframe = true;

    const mesh = new THREE.Mesh(geometry, material);

    const createInternalTicker = () => {
        const tick = (time = 0) => {
            material.uniforms.uTime = { value: time / 1000 };
            window.requestAnimationFrame(tick);
        }

        tick();
    };

    createInternalTicker();

    return {
        geometry,
        material,
        mesh,
    }
};