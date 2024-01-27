import * as THREE from "three";
import {
  FBXLoader,
  GLTFLoader,
  OrbitControls,
  RGBELoader,
} from "three/examples/jsm/Addons.js";
import * as TWEEN from "@tweenjs/tween.js";
import * as GUI from "dat.gui";
import { sphereTest } from "./sphereTest";
import { renderTargetTest } from "./renderTargetTest";
import { Ticker } from "./types";

export const createRenderer = (container: HTMLDivElement) => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // SCENE
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7a6968);

  // LIGHTS
  const frontLight = new THREE.PointLight(0xffffff);
  frontLight.intensity = 5;
  frontLight.castShadow = true;
  frontLight.position.set(0, 10, 5);
  const ambientLight = new THREE.AmbientLight(0xffffff);

  // CAMERAS
  const mainCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 200);
  mainCamera.position.set(0, 10, 20);

  // Renderer
  const mainRenderer = new THREE.WebGLRenderer();
  mainRenderer.shadowMap.enabled = true;
  mainRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mainRenderer.setSize(width, height);
  mainRenderer.setPixelRatio(window.devicePixelRatio);
  const mainRendererCanvas = mainRenderer.domElement;

  // Orbit Controls
  const orbitControls = new OrbitControls(mainCamera, mainRendererCanvas);
  // orbitControls.enableDamping = true;

  // Animation mixers
  const mixers: THREE.AnimationMixer[] = [];
  let lastTickInSeconds = 0;
  let ticker: Ticker;
  const createTicker = () => {
    let id = 0;
    const render = (time: number) => {
      const timeInSeconds = time / 1000;
      TWEEN.update(time);
      mainRenderer.render(scene, mainCamera);

      mixers.forEach((m) => m.update(timeInSeconds - lastTickInSeconds));
      lastTickInSeconds = time / 1000;
    };

    const tick = (time: number = 0) => {
      render(time);
      id = window.requestAnimationFrame(tick);
    };

    tick();

    return {
      id,
      tick,
      render,
    };
  };

  return {
    start() {
      scene.add(frontLight);
      scene.add(ambientLight);
      scene.add(mainCamera);
      container.appendChild(mainRendererCanvas);
      ticker = createTicker();
    },
    renderRoom() {
      const loader = new RGBELoader();
      loader.load("environment.hdr", (texture) => {
        const geometry = new THREE.SphereGeometry(10, 64, 64);
        const material = new THREE.MeshPhongMaterial({
          map: texture,
        });
        material.side = THREE.BackSide;
        const sphere = new THREE.Mesh(geometry, material);
        sphere.receiveShadow = true;
        sphere.castShadow = false;
        sphere.position.set(0, 0, 0);
        scene.add(sphere);
      });
    },
    renderSynthesizerModel() {
      const loader = new GLTFLoader();

      loader.load("synthesizer.glb", function (model) {
        const { scene: modelScene } = model;
        modelScene.scale.set(3, 3, 3);
        scene.add(modelScene);
      });
    },
    renderCapoeiraModel() {
      const plane = new THREE.PlaneGeometry(100, 100);
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(plane, material);
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      mesh.rotateX(-Math.PI / 2);
      scene.add(mesh);

      const animationParts = new Map();

      let capoeira = false;
      let taunt = false;
      window.addEventListener("keydown", (event) => {
        if (event.key === "a" && !capoeira) {
          animationParts.get("taunt").animation.stop();
          animationParts.get("capoeira").animation.play();
          animationParts.get("capoeira").animation.time = 3;
          animationParts.get("capoeira").animation.fadeIn(0.3);
          capoeira = true;
          taunt = false;
        } else if (event.key === "d" && !taunt) {
          animationParts.get("capoeira").animation.stop();
          animationParts.get("taunt").animation.play();
          animationParts.get("taunt").animation.fadeIn(0.3);
          taunt = true;
        }
      });
      window.addEventListener("keyup", (event) => {
        if (event.key === "a") {
          animationParts.get("capoeira").animation.fadeOut(1);
          setTimeout(() => {
            animationParts.get("capoeira").animation.stop();
            capoeira = false;
          }, 1000);
        } else if (event.key === "d") {
          animationParts.get("taunt").animation.fadeOut(0.3);
          setTimeout(() => {
            animationParts.get("taunt").animation.stop();
            taunt = false;
          }, 300);
        }
      });

      const fbxLoader = new FBXLoader();
      fbxLoader.load("character.fbx", (model) => {
        model.scale.setScalar(0.07);
        model.position.set(0, 0, 0);
        model.traverse((node) => {
          node.castShadow = true;
        });

        const animationLoader = new FBXLoader();
        animationLoader.load("capoeira.fbx", (anim) => {
          const capoeira = anim.animations[0];
          // const rightSide: THREE.AnimationClip = THREE.AnimationClip.parse(
          //   THREE.AnimationClip.toJSON(original)
          // );

          const mixer = new THREE.AnimationMixer(model);
          const animation = mixer.clipAction(capoeira);
          animation.setDuration(15);
          animationParts.set("capoeira", {
            clip: capoeira,
            animation,
          });
          mixers.push(mixer);
        });
        animationLoader.load("taunt.fbx", (anim) => {
          const taunt = anim.animations[0];

          const mixer = new THREE.AnimationMixer(model);
          const animation = mixer.clipAction(taunt);
          animationParts.set("taunt", {
            clip: taunt,
            animation,
          });
          mixers.push(mixer);
        });
        scene.add(model);
      });
    },

    renderSphere() {
      const sphere = sphereTest();
      scene.add(sphere.mesh);
      sphere.startTick();
    },

    renderTargetTexture() {
      if (!ticker) {
        return;
      }
      window.cancelAnimationFrame(ticker.id);
      const renderTargetTexture = renderTargetTest(mainRenderer, ticker);

      // const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
      const geometry = new THREE.SphereGeometry(5, 128, 128);
      const material = new THREE.MeshStandardMaterial({
        map: renderTargetTexture.renderTarget.texture,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(5, 0, 0);

      const light = new THREE.PointLight(0xffffff, 2000);
      light.position.set(0, 10, -5);
      scene.add(light);
      const light1 = new THREE.PointLight(0xffff00, 2000);
      light1.position.set(-5, -10, -5);
      scene.add(light1);
      const light2 = new THREE.PointLight(0xff0000, 2000);
      light2.position.set(10, 10, 0);
      scene.add(light2);

      scene.add(mesh);
      renderTargetTexture.start();
    },
  };
};
