import * as THREE from "three";
import {
  FBXLoader,
  GLTFLoader,
  OrbitControls,
  RGBELoader,
} from "three/examples/jsm/Addons.js";
import * as TWEEN from "@tweenjs/tween.js";
import { sphereTest } from "./sphereTest";
import { renderTargetTest } from "./renderTargetTest";
import { Ticker } from "./types";
import { videoTexture } from "./videoTexture";
import { cubeMap } from "./cubeMap";
import { displacementTest } from "./displacementTests";
import { particlesTests } from "./particlesTests";
// import modelParticlesVertex from "./shaders/modelParticles.vert.glsl";
// import modelParticlesFragment from "./shaders/modelParticles.frag.glsl";
import { guitarHero } from "./guitar-hero/guitarHero";
import { earTraining } from "./ear-training/earTraining";

export const createRenderer = (container: HTMLDivElement) => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  // SCENE
  const scene = new THREE.Scene();

  // LIGHTS
  const frontLight = new THREE.PointLight(0xffffff);
  frontLight.intensity = 100;
  frontLight.castShadow = true;
  frontLight.position.set(0, 10, 0);
  const ambientLight = new THREE.AmbientLight(0xffffff);

  // CAMERAS
  const mainCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  mainCamera.position.set(0, 2, 20);

  // RENDERER
  const mainRenderer = new THREE.WebGLRenderer({ alpha: true });
  mainRenderer.shadowMap.enabled = true;
  mainRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
  mainRenderer.setSize(width, height);
  mainRenderer.setPixelRatio(window.devicePixelRatio);
  mainRenderer.setClearColor(0x000000, 0);
  const mainRendererCanvas = mainRenderer.domElement;

  // ORBIT CONTROLS
  const orbitControls = new OrbitControls(mainCamera, mainRendererCanvas);
  orbitControls.enableDamping = true;

  // ANIMATION MIXERS
  const mixers: THREE.AnimationMixer[] = [];
  let lastTickInSeconds = 0;

  // ANIMATION LOOP FACTORY
  let ticker: Ticker;
  const createTicker = () => {
    let id = 0;
    const render = (time: number) => {
      const timeInSeconds = time / 1000;
      TWEEN.update(time);
      orbitControls.update();
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
      window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        mainRenderer.setSize(width, height);
        mainCamera.aspect = width / height;
        mainCamera.updateProjectionMatrix();
      });
    },
    showBackground(color: number = 0x000000) {
      scene.background = new THREE.Color(color);
    },
    autoRotateOrbitControls() {
      orbitControls.autoRotate = true;
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

      // this.autoRotateOrbitControls();
      this.showBackground();

      const animationParts = new Map();

      let capoeira = false;
      let taunt = false;
      window.addEventListener("keydown", (event) => {
        if (event.key === "a" && !capoeira) {
          animationParts.get("taunt").animation.stop();

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

      const fbxLoader = new FBXLoader();
      fbxLoader.load("character.fbx", (model) => {
        model.scale.setScalar(0.07);
        model.position.set(0, 0.01, 0);

        model.children = model.children.map((node: any) => {
          if (node.isSkinnedMesh) {
            node.material.emissive = null;
            node.material.emissiveIntensity = 0;

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute(
              "position",
              node.geometry.attributes.position.clone()
            );
            geometry.setAttribute("uv", node.geometry.attributes.uv.clone());
            geometry.setAttribute(
              "normal",
              node.geometry.attributes.normal.clone()
            );

            geometry.setAttribute(
              "skinIndex",
              node.geometry.attributes.skinIndex.clone()
            );

            geometry.setAttribute(
              "skinWeight",
              node.geometry.attributes.skinWeight.clone()
            );

            const colors = new Float32Array(
              geometry.attributes.position.array.length
            );
            for (
              let i = 0;
              i < geometry.attributes.position.array.length;
              i++
            ) {
              const i3 = i * 3;

              colors[i3] = Math.random();
              colors[i3 + 1] = Math.random();
              colors[i3 + 2] = Math.random();
            }

            geometry.setAttribute(
              "color",
              new THREE.BufferAttribute(colors, 3)
            );

            const material = new THREE.MeshStandardMaterial({
              vertexColors: true,
            });

            material.vertexColors = true;
            material.depthWrite = false;
            const points = new THREE.Points(geometry, material);
            points.scale.setScalar(0.07);

            (points as any).skeleton = node.skeleton;
            (points as any).bindMatrix = node.bindMatrix;
            (points as any).bindMatrixInverse = node.bindMatrixInverse;
            (points as any).bindMode = node.bindMode;
            (points as any).isSkinnedMesh = true;

            points.updateMatrixWorld = node.updateMatrixWorld;
            points.castShadow = true;
            return points;
          }
          return node;
        });

        fbxLoader.load("capoeira.fbx", (anim) => {
          const capoeira = anim.animations[0];
          // const rightSide: THREE.AnimationClip = THREE.AnimationClip.parse(
          //   THREE.AnimationClip.toJSON(original)
          // );

          const mixer = new THREE.AnimationMixer(model);
          const animation = mixer.clipAction(capoeira);
          // animation.setDuration(15);
          animationParts.set("capoeira", {
            clip: capoeira,
            animation,
          });
          mixers.push(mixer);
          animationParts.get("capoeira").animation.play();
        });

        scene.add(model);
      });
    },

    renderSphere() {
      const testData = sphereTest();
      const [sphere, sphere1] = testData.meshes;
      scene.add(sphere);
      scene.add(sphere1);
      testData.startTick();
    },

    renderTargetTexture() {
      if (!ticker) {
        return;
      }
      window.cancelAnimationFrame(ticker.id);

      this.autoRotateOrbitControls();

      const renderTargetTexture = renderTargetTest(mainRenderer, ticker);
      this.showBackground();

      // const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
      const geometry = new THREE.SphereGeometry(5, 128, 128);

      const material = new THREE.MeshStandardMaterial({
        map: renderTargetTexture.renderTarget.texture,
        blending: THREE.AdditiveBlending,
        metalness: 0,
        roughness: 1,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);

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

    async renderVideoTexture() {
      let state = "stop";
      let mouseMoving = false;
      let timeoutId = 0;
      const textureData = await videoTexture();
      window.addEventListener("mousedown", () => {
        timeoutId = setTimeout(() => {
          mouseMoving = true;
        }, 100);
      });
      window.addEventListener("mouseup", () => {
        clearTimeout(timeoutId);
        if (mouseMoving) {
          mouseMoving = false;
          return;
        }

        if (state === "stop") {
          state = "play";
          textureData.video.play();
          return;
        }

        state = "stop";
        textureData.video.pause();
        textureData.video.currentTime = 0;
      });
      scene.add(textureData.mesh);
    },

    async renderCubeMap() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      // Video element to attach the webcam
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.style.position = "absolute";
      video.style.top = "0";
      video.style.zIndex = "10";
      video.style.transform = "scaleX(-1)";
      // video.style.display = "none";
      video.width = window.innerWidth;
      video.height = window.innerHeight;
      document.body.appendChild(video);

      // Canvas that will clone the video image
      const canvasVideo = document.createElement("canvas");
      canvasVideo.width = video.width;
      canvasVideo.height = video.height;
      canvasVideo.style.position = "absolute";
      canvasVideo.style.zIndex = "10";
      canvasVideo.style.top = "0";
      canvasVideo.style.left = "0";
      canvasVideo.style.transform = "scaleX(-1)";

      // Clone video image
      const context = canvasVideo.getContext("2d") as CanvasRenderingContext2D;
      // document.body.appendChild(canvasVideo);
      const settings = stream.getTracks()[0].getSettings();
      context.scale(
        video.width / (settings.width ?? video.width),
        video.height / (settings.height ?? video.height)
      );

      // Canvas that will hold the extracted image from canvasVideo
      const backgroundWidth = 600;
      const backgroundHeight = 800;
      const canvasBackground = document.createElement("canvas");
      const contextBg = canvasBackground.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      canvasBackground.width = backgroundWidth;
      canvasBackground.height = backgroundHeight;
      canvasBackground.style.position = "absolute";
      canvasBackground.style.zIndex = "30";
      canvasBackground.style.top = "0";
      canvasBackground.style.left = "0";
      canvasBackground.style.transform = "scaleX(-1)";
      // document.body.appendChild(canvasBackground);

      const geometry = new THREE.SphereGeometry(5, 128, 128);
      const material = new THREE.MeshPhysicalMaterial({
        // color: 0xab43f3,
        metalness: 0.9,
        roughness: 0.5,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);

      scene.add(mesh);

      const internalTicker = async () => {
        // Extract a 3:4 part of the webcam image cloned in the canvasVideo
        context.drawImage(video, 0, 0);
        const data = context.getImageData(
          (canvasVideo.width - backgroundWidth) / 2,
          canvasVideo.height - backgroundHeight,
          backgroundWidth,
          backgroundHeight
        );
        contextBg.putImageData(data, 0, 0);

        // Create cube map from canvas
        const cube = await cubeMap(canvasVideo);
        const { images } = cube;

        const texture = new THREE.CubeTextureLoader().load(
          [
            images[0].toDataURL(),
            images[1].toDataURL(),
            images[2].toDataURL(),
            images[3].toDataURL(),
            images[4].toDataURL(),
            images[5].toDataURL(),
          ],
          async () => {
            // (Un)Comment the next line to show the cube map as the scene background
            // setting it as the environment map will already create the reflection in scene objects
            // scene.background = texture;
            scene.environment = texture;
          }
        );

        window.requestAnimationFrame(internalTicker);
      };
      internalTicker();
    },

    renderDisplacementTest() {
      this.showBackground(0x000000);
      // this.autoRotateOrbitControls();

      const tests = displacementTest();

      // const data = tests.test1();
      // const data = tests.test2();
      const data = tests.test3();
      data.meshes.forEach((mesh) => scene.add(mesh));
    },

    renderParticleTests() {
      this.showBackground(0x000000);

      const tests = particlesTests();

      // const { particles } = tests.test1();
      // const { particles } = tests.test2();
      // const { particles } = tests.test3();
      // const { particles } = tests.test4();
      const { particles } = tests.test5();

      scene.add(particles);
    },

    async renderGuitarHero() {
      this.showBackground(0x000000);
      const game = guitarHero();

      game.render(scene, mainCamera);

      mainCamera.position.z = 60;
      mainCamera.position.y = 10;
      mainCamera.lookAt(new THREE.Vector3(0, 0, 0));
    },

    renderEarTraining() {
      this.showBackground(0x000000);
      const module = earTraining();

      mainCamera.position.z = 25;
      mainCamera.position.y = 0;
      module.render(scene, mainCamera);
    },
  };
};
