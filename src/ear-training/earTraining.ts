import * as THREE from "three";
import { Font, FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";
import {
  AUDIO_LIBS,
  AudioLib,
  INTERVALS,
  Interval,
} from "./constants/constants";

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
  const geometry = new TextGeometry(
    "Acerte os intervalos e\ndeixe as partículas verdes",
    {
      font: fonts.get("roboto") as Font,
      size: 1,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: false,
    }
  );
  const material = new THREE.MeshStandardMaterial({
    color: 0xf28700,
  });

  geometry.computeBoundingBox();
  geometry.center();

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -15;

  const geometry1 = new TextGeometry("Iniciar Jogo!", {
    font: fonts.get("roboto") as Font,
    size: 1,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: false,
  });
  const material1 = new THREE.MeshStandardMaterial({
    color: 0xf287f7,
  });

  geometry1.computeBoundingBox();
  geometry1.center();

  const mesh1 = new THREE.Mesh(geometry1, material1);
  mesh1.name = "playButton";
  mesh1.position.y = -3;
  mesh1.position.z = -15;

  const group = new THREE.Group();

  group.add(mesh, mesh1);
  return group;
};

const renderReplayButton = (fonts: Map<string, Font>) => {
  const group = new THREE.Group();

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

  group.add(text);
  group.position.z = -15;
  return group;
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
    mesh.position.set(0, 0, -15);
    intervalsMeshes.set(interval.id, mesh);
  });

  return intervalsMeshes;
};

const createParticles = () => {
  const geometry = new THREE.BufferGeometry();

  const material = new THREE.PointsMaterial({
    size: 0.001,
    sizeAttenuation: true,
    depthWrite: false,
    vertexColors: true,
  });

  const particles = new THREE.Points(geometry, material);

  const size = 50000;

  const positions = new Float32Array(size * 3);
  const colors = new Float32Array(size * 3);
  for (let i = 0; i < size; i++) {
    const i3 = i * 3;

    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
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
      console.log(index);
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
  answersGroup.position.z = -10;

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
  let root = 0;
  let rightAnswersPct = 0;

  const fonts = await loadFonts();
  const intervalsMeshes = renderIntervals(fonts);

  return {
    init() {
      particlesBg = createParticles();
      scene.add(particlesBg);

      this.createLandingPage();
    },
    createLandingPage() {
      const homeText = renderLandingPage(fonts);

      const onStart = (position: MouseEvent) => {
        const raycaster = new THREE.Raycaster();
        const pointer = convertFromMouseCoordsToPointer(position);

        raycaster.setFromCamera(pointer, camera);

        const hits = raycaster.intersectObjects(homeText.children);

        if (hits.length > 0) {
          const selected = hits[0].object;

          if (selected.name === "playButton") {
            homeText.children.forEach((child) => {
              (child as THREE.Mesh).geometry.dispose();
              ((child as THREE.Mesh).material as THREE.Material).dispose();

              child.remove(child);
            });
            scene.remove(homeText);
            window.removeEventListener("mouseup", onStart);
            this.startGame();
          }
        }
      };
      window.addEventListener("mouseup", onStart);
      scene.add(homeText);
    },
    startGame() {
      this.createListeners();
      this.createNewInterval();
    },
    createNewInterval() {
      this.chooseInterval();
      this.chooseRootNoteToPlay();
      this.chooseAnswers();

      replayButton = renderReplayButton(fonts);
      if (answersGroup) {
        answersGroup.children.forEach((child) => {
          (child as THREE.Mesh).geometry.dispose();
          ((child as THREE.Mesh).material as THREE.Material).dispose();

          answersGroup.remove(child);
        });
        scene.remove(answersGroup);
      }
      answersGroup = renderAnswers(currentAnswers, intervalsMeshes);

      scene.add(answersGroup);
      scene.add(replayButton);
    },
    createListeners() {
      window.addEventListener("mouseup", (position) => {
        const raycaster = new THREE.Raycaster();
        const pointer = convertFromMouseCoordsToPointer(position);

        raycaster.setFromCamera(pointer, camera);

        const hits = raycaster.intersectObjects(answersGroup.children);

        if (hits.length > 0) {
          const selected = hits[0].object;

          const isRightAnswer = selected.name === currentInterval.id;

          this.onAnswer(isRightAnswer);
        }
      });
    },
    onAnswer(isRightAnswer = false) {
      if (isRightAnswer) {
        rightAnswersPct += 10;

        updateParticlesProgress(particlesBg, rightAnswersPct);
      }

      this.createNewInterval();
    },
    chooseInterval() {
      const randomIndex = Math.floor(Math.random() * 128383) % INTERVALS.length;
      currentInterval = INTERVALS[randomIndex];
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
      let filtered = INTERVALS.filter(
        (interval) => interval.id !== currentInterval.id
      );
      let answers = [currentInterval];
      let randomIndex = Math.floor(Math.random() * 128383) % filtered.length;

      while (answers.length < 4) {
        randomIndex = Math.floor(Math.random() * 128383) % filtered.length;
        const answer = filtered[randomIndex];
        answers.push(answer);
        filtered = filtered.filter(
          (interval) => answer && interval.id !== answer.id
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
