import * as THREE from 'three';
import fragmentShader from './shaders/secondStudy.frag.glsl';
import displacementTestShader from './shaders/displacementTest.vert.glsl';

export const displacementTest = () => {
    const geometry = new THREE.SphereGeometry(2, 128, 128);
    const geometry1 = new THREE.PlaneGeometry(2, 2, 8, 8);
    const geometry2 = new THREE.BoxGeometry(2, 2, 2, 128, 128, 128);
    const geometry3 = new THREE.TorusGeometry(10, 2, 128, 128);
    const geometry4 = new THREE.TorusKnotGeometry(10, 2, 128, 128);
    const material = new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader: displacementTestShader,
        side: THREE.DoubleSide,
    });
    // material.wireframe = true;

    const mesh = new THREE.Mesh(geometry, material);
    const mesh1 = new THREE.Mesh(geometry1, material);
    mesh1.position.set(-10, 2, 0);
    const mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.position.set(10, 2, 0);
    const mesh3 = new THREE.Mesh(geometry3, material);
    mesh3.position.set(0, 10, -5);
    mesh3.scale.setScalar(0.15);
    const mesh4 = new THREE.Mesh(geometry4, material);
    mesh4.position.set(0, -10, -5);
    mesh4.scale.setScalar(0.15);

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
        meshes: [mesh, mesh1, mesh2, mesh3, mesh4],
    }
};