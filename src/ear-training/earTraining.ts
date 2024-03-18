import * as THREE from "three";
import { Font, FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import {
  AUDIO_LIBS,
  AudioLib,
  INTERVALS,
  Interval,
  LEVELS,
  LevelName,
} from "./constants/constants";
import gsap from "gsap";

const loadAudio = async () => {
  const audios = new Map();
  const lib = AUDIO_LIBS[0];
  const promises = [];
  for (let i = lib.firstNote; i <= lib.lastNote; i++) {
    const audio = new Audio();

    const promise = new Promise((resolve) => {
      audio.addEventListener("canplay", () => {
        resolve(true);
      });

      audio.src = `${AUDIO_LIBS[0].folder}/${i}.mp3`;
      audio.load();
    });

    promises.push(promise);
    audios.set(i, audio);
  }

  await Promise.all(promises);

  return audios;
};

const loadFonts = async () => {
  /**
   * Font loader
   */
  const fontLoader = new FontLoader();
  const fonts = new Map();

  const promise = new Promise((resolve) => {
    fontLoader.load("/fonts/roboto/roboto_bold.json", (font) => {
      resolve(font);
    });
  });

  const [roboto] = await Promise.all([promise]);

  fonts.set("roboto", roboto);

  return fonts;
};

const renderLandingPage = (fonts: Map<string, Font>) => {
  const geometry = new TextGeometry("Escolha um nível", {
    font: fonts.get("roboto") as Font,
    size: 1,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: false,
  });
  const material = new THREE.MeshStandardMaterial({
    color: 0xf28700,
  });

  geometry.computeBoundingBox();
  geometry.center();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 2;
  mesh.position.z = 0;

  const geometryEasy = new TextGeometry("Fácil", {
    font: fonts.get("roboto") as Font,
    size: 1,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: false,
  });
  const materialEasy = new THREE.MeshStandardMaterial({
    color: 0xf287f7,
  });

  geometryEasy.computeBoundingBox();
  geometryEasy.center();

  const meshEasy = new THREE.Mesh(geometryEasy, materialEasy);
  meshEasy.name = "easy-text";

  const easyBox = new THREE.Box3().setFromObject(meshEasy);
  const easyWidth = easyBox.max.x - easyBox.min.x;
  const easyHeight = easyBox.max.y - easyBox.min.y;
  const planeEasyGeometry = new THREE.PlaneGeometry(easyWidth, easyHeight);
  const planeEasyMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const planeEasy = new THREE.Mesh(planeEasyGeometry, planeEasyMaterial);
  planeEasy.name = "easy-plane";

  const groupEasy = new THREE.Group();
  groupEasy.add(meshEasy, planeEasy);
  groupEasy.position.y = 0;
  groupEasy.position.z = 0;

  const geometryNormal = new TextGeometry("Normal", {
    font: fonts.get("roboto") as Font,
    size: 1,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: false,
  });
  const materialNormal = new THREE.MeshStandardMaterial({
    color: 0xf287f7,
  });

  geometryNormal.computeBoundingBox();
  geometryNormal.center();

  const meshNormal = new THREE.Mesh(geometryNormal, materialNormal);
  meshNormal.name = "normal-text";

  const normalBox = new THREE.Box3().setFromObject(meshNormal);
  const normalWidth = normalBox.max.x - normalBox.min.x;
  const normalHeight = normalBox.max.y - normalBox.min.y;
  const planeNormalGeometry = new THREE.PlaneGeometry(
    normalWidth,
    normalHeight
  );
  const planeNormalMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const planeNormal = new THREE.Mesh(planeNormalGeometry, planeNormalMaterial);
  planeNormal.name = "normal-plane";

  const groupNormal = new THREE.Group();
  groupNormal.add(meshNormal, planeNormal);
  groupNormal.position.y = -2;
  groupNormal.position.z = 0;

  const geometryHard = new TextGeometry("Difícil", {
    font: fonts.get("roboto") as Font,
    size: 1,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: false,
  });
  const materialHard = new THREE.MeshStandardMaterial({
    color: 0xf287f7,
  });

  geometryHard.computeBoundingBox();
  geometryHard.center();

  const meshHard = new THREE.Mesh(geometryHard, materialHard);
  meshHard.name = "hard-text";

  const hardBox = new THREE.Box3().setFromObject(meshHard);
  const hardWidth = hardBox.max.x - hardBox.min.x;
  const hardHeight = hardBox.max.y - hardBox.min.y;
  const planeHardGeometry = new THREE.PlaneGeometry(hardWidth, hardHeight);
  const planeHardMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  const planeHard = new THREE.Mesh(planeHardGeometry, planeHardMaterial);
  planeHard.name = "hard-plane";

  const groupHard = new THREE.Group();
  groupHard.add(meshHard, planeHard);
  groupHard.position.y = -4;
  groupHard.position.z = 0;

  const group = new THREE.Group();

  group.add(mesh, groupEasy, groupNormal, groupHard);
  return group;
};

const renderReplayButton = (fonts: Map<string, Font>) => {
  const textGeometry = new TextGeometry("Replay", {
    font: fonts.get("roboto") as Font,
    size: 1,
    height: 0.5,
    curveSegments: 12,
  });
  textGeometry.computeBoundingBox();
  textGeometry.center();

  const textMaterial = new THREE.MeshStandardMaterial({
    color: 0xf287f7,
  });
  const text = new THREE.Mesh(textGeometry, textMaterial);

  const box = new THREE.Box3().setFromObject(text);
  const width = box.max.x - box.min.x;
  const height = box.max.y - box.min.y;

  const planeGeometry = new THREE.PlaneGeometry(width, height);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    opacity: 0,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  const group = new THREE.Group();
  group.add(text, plane);
  group.position.z = 0;

  return group;
};

const renderFeedback = (fonts: Map<string, Font>) => {
  const geometry = new TextGeometry("acertô miserávi!", {
    font: fonts.get("roboto") as Font,
    size: 0.5,
    height: 0.25,
    curveSegments: 12,
  });
  geometry.computeBoundingBox();
  geometry.center();

  const material = new THREE.MeshStandardMaterial({
    color: 0x48fb97,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 1;
  return mesh;
};

const renderIntervals = (fonts: Map<string, Font>) => {
  /**
   * Create text meshes
   */
  const intervalsMeshes = new Map();
  INTERVALS.forEach((interval) => {
    const geometry = new TextGeometry(interval.id, {
      font: fonts.get("roboto") as Font,
      size: 2,
      height: 0.5,
      curveSegments: 64,
      bevelEnabled: true,
      bevelSize: 0.05,
      bevelThickness: 0.1,
    });
    geometry.computeBoundingBox();
    geometry.center();
    const material = new THREE.MeshStandardMaterial({
      color: 0xf28700,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = interval.id;

    const box = new THREE.Box3().setFromObject(mesh);
    const width = box.max.x - box.min.x;
    const height = box.max.y - box.min.y;
    const planeGeometry = new THREE.PlaneGeometry(width, height);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = interval.id;

    const group = new THREE.Group();
    group.position.set(0, 0, 0);
    group.add(mesh, plane);

    intervalsMeshes.set(interval.id, group);
  });

  return intervalsMeshes;
};

const createParticles = () => {
  const geometry = new THREE.BufferGeometry();

  const material = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    depthWrite: false,
    vertexColors: true,
  });

  const particles = new THREE.Points(geometry, material);

  const size = 20000;

  const positions = new Float32Array(size * 3);
  const colors = new Float32Array(size * 3);
  for (let i = 0; i < size; i++) {
    const i3 = i * 3;

    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 80;
    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;

    colors[i3] = 0.5;
    colors[i3 + 1] = 0;
    colors[i3 + 2] = 0;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return particles;
};

const renderAnswers = (
  currentAnswers: Interval[],
  intervalsMeshes: Map<string, THREE.Mesh>
) => {
  let posX = 0;
  let posY = 0;
  const stepX = 10;
  const stepY = 10;
  const numColumns = 2;
  const answersGroup = new THREE.Group();

  currentAnswers.forEach((answer, index) => {
    if (index > 0 && index % numColumns === 0) {
      posX = 0;
      posY += stepY;
    } else if (index > 0) {
      posX += stepX;
    }
    const mesh = intervalsMeshes.get(answer.id);

    if (mesh) {
      mesh.position.x = posX;
      mesh.position.y = posY;
      answersGroup.add(mesh);
    }
  });

  answersGroup.position.x = -stepX / 2;
  answersGroup.position.y = -stepY / 2;
  answersGroup.position.z = 0;

  return answersGroup;
};

const updateParticlesProgress = (points: THREE.Points, pct = 0) => {
  const { geometry } = points;

  const size = Math.round(
    (geometry.attributes.position.array.length / 3) * (pct / 100)
  );

  for (let i = 0; i < size; i++) {
    const i3 = i * 3;

    geometry.attributes.color.array[i3] = 0;
    geometry.attributes.color.array[i3 + 1] = 0.5;
    geometry.attributes.color.array[i3 + 2] = 0;
  }
  geometry.attributes.color.needsUpdate = true;
};

const convertFromMouseCoordsToPointer = (position: {
  clientX: number;
  clientY: number;
}) => {
  const pointer = new THREE.Vector2();

  pointer.x = (position.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(position.clientY / window.innerHeight) * 2 + 1;

  return pointer;
};

const createIntervalsGame = async (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  let answersGroup: THREE.Group;
  let particlesBg: THREE.Points;
  let currentInterval: Interval;
  let currentAnswers: Interval[] = [];
  let replayButton: THREE.Group;
  let audioLib: AudioLib = AUDIO_LIBS[0];
  let audios: Map<number, HTMLAudioElement>;
  let isAudioPlaying = false;
  let root = 0;
  let rightAnswersCount = 0;
  let rightAnswersPct = 0;
  let currentLevelName: LevelName = "easy";
  let currentLevel = LEVELS[currentLevelName];
  let levelIntervals: Interval[] = [];
  let intervalId = 0;
  let intervalAudioOn = 0;
  let intervalAudioOff = 0;

  const fonts = await loadFonts();
  const intervalsMeshes = renderIntervals(fonts);

  return {
    init() {
      camera.position.z = window.innerWidth <= 600 ? 40 : 20;
      camera.position.x = -5;
      camera.position.y = 10;

      particlesBg = createParticles();
      scene.add(particlesBg);

      this.createLandingPage();
    },
    createLandingPage() {
      const homeText = renderLandingPage(fonts);

      const onStart = (position: { clientX: number; clientY: number }) => {
        const raycaster = new THREE.Raycaster();
        const pointer = convertFromMouseCoordsToPointer(position);

        raycaster.setFromCamera(pointer, camera);

        const hits = raycaster.intersectObjects(homeText.children);

        if (hits.length > 0) {
          const selected = hits[0].object;

          if (selected.name) {
            homeText.children.forEach((child) => {
              if (child.children) {
                child.children.forEach((grandChild) => {
                  (grandChild as THREE.Mesh).geometry.dispose();
                  (
                    (grandChild as THREE.Mesh).material as THREE.Material
                  ).dispose();
                });
              } else {
                (child as THREE.Mesh).geometry.dispose();
                ((child as THREE.Mesh).material as THREE.Material).dispose();
              }
            });
            scene.remove(homeText);
            window.removeEventListener("mouseup", onStart);
            window.removeEventListener("touchstart", onTouchStart);

            this.startGame(
              selected.name.replace(/-(text|plane)$/gi, "") as LevelName
            );
          }
        }
      };
      const onTouchStart = (event: TouchEvent) => {
        event.preventDefault();
        onStart(event.touches[0]);
      };
      window.addEventListener("click", onStart);
      scene.add(homeText);
    },
    async startGame(level: LevelName) {
      audios = await loadAudio();
      currentLevelName = level;
      currentLevel = LEVELS[currentLevelName];

      levelIntervals = INTERVALS.filter(
        (interval) => currentLevel.intervals.indexOf(interval.id) !== -1
      );

      this.createListeners();
      this.createNewInterval();
    },

    createNewInterval() {
      this.chooseInterval();
      this.chooseRootNoteToPlay();
      this.chooseAnswers();
      this.playCurrentInterval();

      replayButton = renderReplayButton(fonts);
      if (answersGroup) {
        answersGroup.children.forEach((child) => {
          child.children.forEach((grandChild) => {
            (grandChild as THREE.Mesh).geometry.dispose();
            ((grandChild as THREE.Mesh).material as THREE.Material).dispose();
          });

          answersGroup.remove(child);
        });
        scene.remove(answersGroup);
      }
      answersGroup = renderAnswers(currentAnswers, intervalsMeshes);

      scene.add(answersGroup);
      scene.add(replayButton);
    },
    createListeners() {
      const onIntervalClick = (position: {
        clientX: number;
        clientY: number;
      }) => {
        const raycaster = new THREE.Raycaster();
        const pointer = convertFromMouseCoordsToPointer(position);

        raycaster.setFromCamera(pointer, camera);

        const hits = raycaster.intersectObjects(answersGroup.children);

        if (hits.length > 0) {
          const selected = hits[0].object;
          const isRightAnswer = selected.name === currentInterval.id;

          this.onAnswer(isRightAnswer);
        }

        const replayHits = raycaster.intersectObjects(replayButton.children);
        if (replayHits.length > 0 && !isAudioPlaying) {
          this.playCurrentInterval();
        }
      };

      const onTouchStart = (event: TouchEvent) => {
        event.preventDefault();
        onIntervalClick(event.touches[0]);
      };

      window.addEventListener("click", onIntervalClick, false);
    },
    onAnswer(isRightAnswer = false) {
      if (isRightAnswer) {
        rightAnswersCount += 1;
        rightAnswersPct = (rightAnswersCount / currentLevel.totalAnswers) * 100;

        updateParticlesProgress(particlesBg, rightAnswersPct);
        this.showCorrectAnswerFeedback();
      }

      this.createNewInterval();
    },
    playCurrentInterval() {
      clearTimeout(intervalAudioOn);
      clearTimeout(intervalAudioOff);
      clearInterval(intervalId);

      const rootAudio = audios.get(root);
      const intervalAudio = audios.get(root + currentInterval.distance);
      // The count avoids infinite loop when 1J
      let count = 0;
      intervalAudio?.addEventListener("ended", () => {
        if (count === 1) {
          isAudioPlaying = false;
        }
      });
      rootAudio?.addEventListener("ended", () => {
        if (count === 0) {
          intervalAudio?.play();
        }
        count += 1;
      });

      isAudioPlaying = true;
      rootAudio?.play();
    },
    showCorrectAnswerFeedback() {
      const feedback = renderFeedback(fonts);

      gsap.to(feedback.scale, {
        x: 5,
        y: 5,
        z: 5,
        duration: 1,
        ease: "elastic.inOut",
        onComplete: () => {
          feedback.geometry.dispose();
          feedback.material.dispose();
          scene.remove(feedback);
        },
      });
      scene.add(feedback);
    },
    chooseInterval() {
      const randomIndex =
        Math.floor(Math.random() * 128383) % levelIntervals.length;
      currentInterval = levelIntervals[randomIndex];
    },
    chooseRootNoteToPlay() {
      const min = audioLib.firstNote;
      const max = audioLib.lastNote;
      let randomNote = 99999;
      while (randomNote + currentInterval.distance > max) {
        randomNote = Math.floor(Math.random() * (max - min) + min);
      }

      root = randomNote;
    },
    chooseAnswers() {
      let filtered = levelIntervals.filter(
        (interval) =>
          interval.id !== currentInterval.id &&
          interval.distance !== currentInterval.distance
      );
      let answers = [currentInterval];
      let randomIndex = Math.floor(Math.random() * 128383) % filtered.length;

      while (answers.length < 4) {
        randomIndex = Math.floor(Math.random() * 128383) % filtered.length;
        const answer = filtered[randomIndex];
        answers.push(answer);
        filtered = filtered.filter(
          (interval) =>
            answer &&
            interval.id !== answer.id &&
            interval.distance !== answer.distance
        );
      }

      const shuffled: Interval[] = [];

      while (shuffled.length < 4) {
        randomIndex = Math.floor(Math.random() * 128383) % answers.length;
        let answer = answers[randomIndex];
        while (
          shuffled.find((interval) => answer && interval.id === answer.id)
        ) {
          randomIndex = Math.floor(Math.random() * 128383) % answers.length;
          answer = answers[randomIndex];
        }

        shuffled.push(answer);
      }

      currentAnswers = shuffled;
    },
  };
};

export const earTraining = () => {
  return {
    async render(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
      const intervalsGame = await createIntervalsGame(scene, camera);

      intervalsGame.init();
    },
  };
};
