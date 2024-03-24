import * as THREE from "three";
import gsap from "gsap";
import "./guitarHero.css";

import { Song } from "./types";
import { SONGS } from "./songs";
import { lyrics } from "./lyrics";

export const guitarHero = () => {
  let currentSong: Song;
  let audioContext: AudioContext;
  let audioSource: AudioBufferSourceNode;
  let camera: THREE.PerspectiveCamera;
  let scene: THREE.Scene;
  let hits = 0;
  const textureLoader = new THREE.TextureLoader();
  const matcapMarker = textureLoader.load("/material/matcaps/128/3.png");
  const matcapNote = textureLoader.load("/material/matcaps/128/2.png");

  const lanesPositions = [-6, -2, 2, 6];
  const guitarPosZ = 0;
  const lanesPosZ = 0.5;
  const markersPosZ = 1;
  const notesPosZ = 1.5;
  // Colors from https://coolors.co/ae38fb-00bfb2-ffcb77-363537-ef2d56
  const markerColors = [0xae38fb, 0xff6666, 0x00bfb2, 0xffcb77];

  const convertFromMouseCoordsToPointer = (position: {
    clientX: number;
    clientY: number;
  }) => {
    const pointer = new THREE.Vector2();

    pointer.x = (position.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(position.clientY / window.innerHeight) * 2 + 1;

    return pointer;
  };

  const renderGuitar = () => {
    const geometry = new THREE.PlaneGeometry(12, 200);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff48f7,
    });

    const mesh = new THREE.Mesh(geometry, material);

    const guitar = new THREE.Group();
    guitar.add(mesh);
    guitar.position.y = 100;
    guitar.position.z = guitarPosZ;

    return guitar;
  };

  const renderLanes = () => {
    const lineGeometry = new THREE.CylinderGeometry(0.1, 0.1, 200);

    const lineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const line1 = new THREE.Mesh(lineGeometry, lineMaterial);
    const line2 = new THREE.Mesh(lineGeometry, lineMaterial);
    const line3 = new THREE.Mesh(lineGeometry, lineMaterial);
    const line4 = new THREE.Mesh(lineGeometry, lineMaterial);
    line1.position.x = lanesPositions[0];
    line2.position.x = lanesPositions[1];
    line3.position.x = lanesPositions[2];
    line4.position.x = lanesPositions[3];

    const lanes = new THREE.Group();
    lanes.add(line1, line2, line3, line4);
    lanes.position.y = 100;
    lanes.position.z = lanesPosZ;

    return lanes;
  };

  const renderMarkers = () => {
    const markerGeometry = new THREE.CylinderGeometry(0.75, 0.75, 0.25, 64, 64);
    const markerMaterial1 = new THREE.MeshMatcapMaterial({
      matcap: matcapMarker,
      color: markerColors[0],
    });

    const markerMaterial2 = new THREE.MeshMatcapMaterial({
      matcap: matcapMarker,
      color: markerColors[1],
    });

    const markerMaterial3 = new THREE.MeshMatcapMaterial({
      matcap: matcapMarker,
      color: markerColors[2],
    });

    const markerMaterial4 = new THREE.MeshMatcapMaterial({
      matcap: matcapMarker,
      color: markerColors[3],
    });

    const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
    });

    const planeMarker1 = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMarker1.name = "planeMarker1";
    const planeMarker2 = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMarker2.name = "planeMarker2";
    const planeMarker3 = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMarker3.name = "planeMarker3";
    const planeMarker4 = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMarker4.name = "planeMarker4";

    const marker1 = new THREE.Mesh(markerGeometry, markerMaterial1);
    marker1.name = "marker1";
    const marker2 = new THREE.Mesh(markerGeometry, markerMaterial2);
    marker2.name = "marker2";
    const marker3 = new THREE.Mesh(markerGeometry, markerMaterial3);
    marker3.name = "marker3";
    const marker4 = new THREE.Mesh(markerGeometry, markerMaterial4);
    marker4.name = "marker4";

    marker1.position.x = lanesPositions[0];
    marker2.position.x = lanesPositions[1];
    marker3.position.x = lanesPositions[2];
    marker4.position.x = lanesPositions[3];

    planeMarker1.position.x = marker1.position.x;
    planeMarker2.position.x = marker2.position.x;
    planeMarker3.position.x = marker3.position.x;
    planeMarker4.position.x = marker4.position.x;
    planeMarker1.position.y = 0.75;
    planeMarker2.position.y = 0.75;
    planeMarker3.position.y = 0.75;
    planeMarker4.position.y = 0.75;

    const markers = new THREE.Group();

    const marker1Group = new THREE.Group();
    marker1Group.add(marker1, planeMarker1);
    const marker2Group = new THREE.Group();
    marker2Group.add(marker2, planeMarker2);
    const marker3Group = new THREE.Group();
    marker3Group.add(marker3, planeMarker3);
    const marker4Group = new THREE.Group();
    marker4Group.add(marker4, planeMarker4);

    markers.add(marker1Group, marker2Group, marker3Group, marker4Group);
    markers.position.z = markersPosZ;
    markers.rotation.x = Math.PI * 0.5;

    return markers;
  };

  const renderLyrics = () => {
    const lyricsContainer = document.createElement("div");
    lyricsContainer.classList.add("lyrics-container");
    const currentLyrics = lyrics.find((l) => l.song === currentSong.id);
    const linesContainer = document.createElement("div");
    linesContainer.classList.add("lines-container");

    currentLyrics?.lines.forEach((line, index) => {
      const lineElement = document.createElement("div");
      lineElement.innerHTML = line.title;
      lineElement.style.opacity = "0.5";
      gsap.to(lineElement.style, {
        opacity: 1,
        duration: 0.2,
        delay: line.time,
      });
      gsap.to(linesContainer, {
        y: 34 - index * 32,
        duration: 0.2,
        delay: line.time,
      });
      if (currentLyrics.lines[index + 1]) {
        const delay = currentLyrics.lines[index + 1].time - line.time;
        gsap.to(lineElement.style, {
          opacity: 0.5,
          duration: 0.2,
          delay: line.time + delay,
        });
      }
      linesContainer.appendChild(lineElement);
    });

    lyricsContainer.appendChild(linesContainer);
    document.body.appendChild(lyricsContainer);
  };

  const renderNotes = (lanes: THREE.Group) => {
    const noteGeometry = new THREE.SphereGeometry(0.75, 64, 64);
    const noteMaterials = [
      new THREE.MeshMatcapMaterial({
        matcap: matcapNote,
        color: markerColors[0],
      }),
      new THREE.MeshMatcapMaterial({
        matcap: matcapNote,
        color: markerColors[1],
      }),
      new THREE.MeshMatcapMaterial({
        matcap: matcapNote,
        color: markerColors[2],
      }),
      new THREE.MeshMatcapMaterial({
        matcap: matcapNote,
        color: markerColors[3],
      }),
    ];

    const notes = new THREE.Group();
    notes.position.z = notesPosZ;

    const notesData = currentSong.notes;

    const animationTime = currentSong.duration;
    const bpm = currentSong.bpm;
    const bps = bpm / 60;
    const noteSpacing = 5;
    const totalDistance = currentSong.duration * noteSpacing * bps;

    for (let noteData of notesData) {
      const note = new THREE.Mesh(
        noteGeometry,
        noteMaterials[noteData.lane - 1]
      );
      note.position.x = lanes.children[noteData.lane - 1].position.x;
      const noteDistance = noteData.time * noteSpacing * bps;
      note.position.y += noteDistance;

      notes.add(note);
    }

    return {
      notes,
      animationTime,
      totalDistance,
    };
  };

  const computeNoteHit = (
    notes: THREE.Group,
    note: THREE.Mesh,
    marker: THREE.Mesh
  ) => {
    hits += 1;
    // const note: any = notesHit[0].object;

    notes.remove(note);

    note.position.x = marker.position.x;
    note.position.y = marker.position.y;
    note.position.z = 40;
    scene.add(note);
    gsap.to(note.position, {
      y: note.position.y + 5,
      duration: 0.3,
      ease: "bounce.in",
    });
    gsap.to(note.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.3,
      ease: "bounce.in",
      onComplete() {
        note.geometry.dispose();
        (note.material as THREE.MeshStandardMaterial).dispose();
        scene.remove(note);
      },
    });
  };

  const checkIsNoteOverMarker = (notes: THREE.Group, marker: THREE.Mesh) => {
    const markerX = marker.position.x;

    const notesY = notes.position.y;

    notes.children
      .filter((note) => note.position.x === markerX)
      .forEach((note) => {
        const noteYPosition = note.position.y - Math.abs(notesY);
        if (noteYPosition >= -2 && noteYPosition <= 2) {
          computeNoteHit(notes, note as THREE.Mesh, marker);
        }
      });
  };

  const checkClick = (
    position: { clientX: number; clientY: number },
    markers: THREE.Group,
    notes: THREE.Group
  ) => {
    const raycaster = new THREE.Raycaster();
    const pointer = convertFromMouseCoordsToPointer(position);

    raycaster.setFromCamera(pointer, camera);

    const markersHit = raycaster.intersectObjects(markers.children);

    if (markersHit.length > 0) {
      const hitObject = markersHit[0].object;
      const index = parseInt(
        hitObject.name.replace(/(marker|planeMarker)/, "")
      );

      const markerGroup = markers.children[index - 1];

      const marker = markerGroup.children[0] as THREE.Mesh;

      checkIsNoteOverMarker(notes, marker);
    }
  };

  const renderCurrentSong = () => {
    const guitar = renderGuitar();
    const lanes = renderLanes();
    const markers = renderMarkers();
    renderLyrics();
    const { notes, animationTime, totalDistance } = renderNotes(lanes);

    const animate = () => {
      const timeline = gsap.timeline();
      timeline.to(notes.position, {
        y: notes.position.y - totalDistance,
        ease: "none",
        duration: animationTime,
      });
    };

    // Start the animation and the song
    audioSource.start();
    animate();

    window.addEventListener("touchstart", (evt) => {
      evt.preventDefault();
      const touch = evt.touches[0];
      checkClick(touch, markers, notes);
    });
    window.addEventListener("mousedown", (evt) => {
      evt.preventDefault();
      checkClick(evt, markers, notes);
    });
    window.addEventListener("touchend", (evt) => {
      evt.preventDefault();
    });
    window.addEventListener("mouseup", (evt) => {
      evt.preventDefault();
    });

    const allowedKeys = ["a", "s", "d", "f"];
    window.addEventListener("keydown", (evt): void => {
      if (!allowedKeys.includes(evt.key)) {
        return;
      }

      const index = allowedKeys.indexOf(evt.key);
      const marker = markers.children[index].children[1] as THREE.Mesh;

      checkIsNoteOverMarker(notes, marker);
    });

    const game = new THREE.Group();
    game.add(guitar, lanes, markers, notes);
    game.position.z = 40;
    game.rotation.x = -Math.PI * 0.5;

    return [game];
  };

  const loadSong = async (song: Song) => {
    currentSong = song;

    audioContext = new AudioContext();

    const response = await fetch(song.file);
    const buffer = await response.arrayBuffer();

    const audioBuffer = await audioContext.decodeAudioData(buffer);

    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);

    return true;
  };

  return {
    async render(mainScene: THREE.Scene, mainCamera: THREE.PerspectiveCamera) {
      camera = mainCamera;
      scene = mainScene;
      await loadSong(SONGS[3]);
      let meshes;
      const initSong = () => {
        meshes = renderCurrentSong();
        for (const mesh of meshes) {
          scene.add(mesh);
        }
        window.removeEventListener("click", initSong);
      };

      window.addEventListener("click", initSong);
    },
  };
};
