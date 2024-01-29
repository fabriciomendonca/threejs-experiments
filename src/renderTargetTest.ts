import * as THREE from "three";
import fragmentShader from "./shaders/sphereTest.frag.glsl";
import vertexShader from "./shaders/sphereTest.vert.glsl";
import { Ticker } from "./types";

export const renderTargetTest = (
  renderer: THREE.WebGLRenderer,
  ticker: Ticker,
) => {
  const fakeScene = new THREE.Scene();
  const renderTarget = new THREE.WebGLRenderTarget(
    renderer.domElement.width,
    renderer.domElement.height
  );

  const fakeCamera = new THREE.PerspectiveCamera(60, 1.0, 0.01, 100.0);
  fakeCamera.position.set(0.0, 0.0, 3.0);
  fakeCamera.lookAt(new THREE.Vector3());

  const geometry = new THREE.PlaneGeometry(5, 5, 128, 128);
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      uTime: { value: 0 },
    },
  });
  const mesh = new THREE.Mesh(geometry, material);

  const internalTick = (time: number) => {
    material.uniforms.uTime = { value: time / 1000 };
    renderer.setRenderTarget(renderTarget);
    renderer.clear();
    renderer.render(fakeScene, fakeCamera);
    renderer.setRenderTarget(null);
    
    ticker.render(time);
    requestAnimationFrame(internalTick);
  };

  return {
    geometry,
    material,
    mesh,
    fakeScene,
    fakeCamera,
    renderTarget,
    start() {
      internalTick(0);
      fakeScene.add(mesh);
      fakeScene.add(fakeCamera);
    },
  };
};
