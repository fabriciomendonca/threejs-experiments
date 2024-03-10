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
  const renderLanes = () => {
    const lineGeometry = new THREE.CylinderGeometry(0.1, 0.1, 500);

    const lineMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const line1 = new THREE.Mesh(lineGeometry, lineMaterial);
    const line2 = new THREE.Mesh(lineGeometry, lineMaterial);
    const line3 = new THREE.Mesh(lineGeometry, lineMaterial);
    const line4 = new THREE.Mesh(lineGeometry, lineMaterial);
    line1.rotation.x = -Math.PI * 0.5;
    line2.rotation.x = -Math.PI * 0.5;
    line3.rotation.x = -Math.PI * 0.5;
    line4.rotation.x = -Math.PI * 0.5;
    line1.position.z = -200;
    line2.position.z = -200;
    line3.position.z = -200;
    line4.position.z = -200;
    line1.position.x = lanesPositions[0];
    line2.position.x = lanesPositions[1];
    line3.position.x = lanesPositions[2];
    line4.position.x = lanesPositions[3];

    const lanes = new THREE.Group();
    lanes.add(line1, line2, line3, line4);

    return lanes;
  };

  // Colors from https://coolors.co/ae38fb-00bfb2-ffcb77-363537-ef2d56
  const markerColors = [0xae38fb, 0xff6666, 0x00bfb2, 0xffcb77];

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
      opacity: 0,
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
    marker1.position.z = 40;
    marker2.position.z = 40;
    marker3.position.z = 40;
    marker4.position.z = 40;

    planeMarker1.position.x = lanesPositions[0];
    planeMarker1.position.z = marker1.position.z - 0.75;
    planeMarker1.position.y = 0.75;
    planeMarker2.position.x = lanesPositions[1];
    planeMarker2.position.z = marker1.position.z - 0.75;
    planeMarker2.position.y = 0.75;
    planeMarker3.position.x = lanesPositions[2];
    planeMarker3.position.z = marker1.position.z - 0.75;
    planeMarker3.position.y = 0.75;
    planeMarker4.position.x = lanesPositions[3];
    planeMarker4.position.z = marker1.position.z - 0.75;
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
    markers.position.y = 0.225;

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
      console.log("Animate to", 50 - index * 16);
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

  const renderCurrentSong = () => {
    const lanes = renderLanes();
    const markers = renderMarkers();
    renderLyrics();

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
    notes.position.z = 40;

    const notesData = currentSong.notes;

    const bpm = currentSong.bpm;
    const bps = bpm / 60;
    const noteSpacing = 5;

    let distance = currentSong.duration * noteSpacing * bps;
    let animationTime = currentSong.duration;

    for (let noteData of notesData) {
      const note = new THREE.Mesh(
        noteGeometry,
        noteMaterials[noteData.lane - 1]
      );
      note.position.x = lanes.children[noteData.lane - 1].position.x;
      const noteDistance = noteData.time * noteSpacing * bps;
      note.position.z -= noteDistance;

      notes.add(note);
    }
    notes.position.y = 0.75 + 0.1 + 0.225;

    const animate = () => {
      const timeline = gsap.timeline();
      timeline.to(notes.position, {
        z: notes.position.z + distance,
        ease: "none",
        duration: animationTime,
      });
    };

    // Start the animation and the song
    audioSource.start();
    animate();

    const convertFromMouseCoordsToPointer = (position: {
      clientX: number;
      clientY: number;
    }) => {
      const pointer = new THREE.Vector2();

      pointer.x = (position.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(position.clientY / window.innerHeight) * 2 + 1;

      return pointer;
    };

    let marker: any;
    const computeNoteHit = (notesHit: any) => {
      hits += 1;
      const note: any = notesHit[0].object;

      notes.remove(note);

      note.position.x = marker.position.x;
      note.position.y = marker.position.y;
      note.position.z = marker.position.z;
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
          note.material.dispose();
          scene.remove(note);
        },
      });
    };
    const checkPlaneMarkerHit = (marker: any) => {
      let vector = new THREE.Vector3(
        marker.position.x,
        marker.position.y,
        marker.position.z
      );
      vector.project(camera);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(vector.x, vector.y), camera);
      const notesHit = raycaster.intersectObjects(notes.children);
      if (notesHit.length > 0) {
        const note = notesHit[0].object;
        const distanceToMark = notes.position.z - Math.abs(note.position.z);
        if (
          distanceToMark >= marker.position.z - 4 &&
          distanceToMark <= marker.position.z + 4
        ) {
          computeNoteHit(notesHit);
        }
      }
    };
    const checkClick = (position: { clientX: number; clientY: number }) => {
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

        marker = markerGroup.children[1];

        checkPlaneMarkerHit(marker);
      }
    };

    window.addEventListener("touchstart", (evt) => {
      evt.preventDefault();
      const touch = evt.touches[0];
      checkClick(touch);
    });
    window.addEventListener("mousedown", (evt) => {
      evt.preventDefault();
      checkClick(evt);
    });
    window.addEventListener("touchend", (evt) => {
      evt.preventDefault();
      marker.material.color = new THREE.Color(0xae38fb);
    });
    window.addEventListener("mouseup", (evt) => {
      evt.preventDefault();
      marker.material.color = new THREE.Color(0xae38fb);
    });

    const allowedKeys = ["a", "s", "d", "f"];
    let isPressed = false;
    window.addEventListener("keypress", (evt): void => {
      if (isPressed || !allowedKeys.includes(evt.key)) {
        return;
      }

      isPressed = true;
      const index = allowedKeys.indexOf(evt.key);
      marker = markers.children[index].children[1];

      checkPlaneMarkerHit(marker);
    });
    window.addEventListener("keyup", (evt) => {
      if (!allowedKeys.includes(evt.key)) {
        return;
      }

      isPressed = false;
    });

    return [lanes, markers, notes];
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
