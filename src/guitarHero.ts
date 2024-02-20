import * as THREE from "three";
import gsap from "gsap";

type Note = {
  time: number;
  lane: number;
};

type Song = {
  id: number;
  name: string;
  introTime: number;
  bpm: number;
  file: string;
  notes: Note[];
};

const SONGS: Song[] = [
  {
    id: 1,
    name: "All of me",
    introTime: 4,
    bpm: 60,
    file: "/all-of-me.mp3",
    notes: [
      { time: 5, lane: 1 },
      { time: 5.66, lane: 3 },
      { time: 6, lane: 2 },
      { time: 7, lane: 2 },
      { time: 8, lane: 2 },
      { time: 9, lane: 1 },
      { time: 10, lane: 1 },
      { time: 11, lane: 1 },
      { time: 12, lane: 2 },
      { time: 13, lane: 2 },
      { time: 13.66, lane: 4 },
      { time: 14, lane: 4 },
      { time: 15, lane: 4 },
      { time: 16, lane: 3 },
      { time: 17, lane: 2 },
      { time: 17.66, lane: 3 },
      { time: 18, lane: 2 },
      { time: 19, lane: 1 },
      { time: 20, lane: 2 },
      { time: 21, lane: 1 },
      { time: 21.66, lane: 1 },
      { time: 23, lane: 3 },
      { time: 24, lane: 3 },
      { time: 25, lane: 4 },
      { time: 25.66, lane: 2 },
      { time: 26, lane: 4 },
      { time: 27, lane: 2 },
      { time: 28, lane: 2 },
      { time: 29, lane: 3 },
      { time: 29.66, lane: 4 },
      { time: 30, lane: 1 },
      { time: 31, lane: 3 },
      { time: 32, lane: 4 },
      { time: 33, lane: 2 },
      { time: 33.66, lane: 1 },
      { time: 34, lane: 1 },
      { time: 35, lane: 3 },
      { time: 36, lane: 4 },
    ],
  },
];

export const guitarHero = () => {
  let currentSong: Song;
  let audioContext: AudioContext;
  let audioSource: AudioBufferSourceNode;

  const renderLanes = () => {
    const lineGeometry = new THREE.CylinderGeometry(0.1, 0.1, 500);

    const lineMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
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
    line1.position.x = -3;
    line2.position.x = -1;
    line3.position.x = 1;
    line4.position.x = 3;

    const lanes = new THREE.Group();
    lanes.add(line1, line2, line3, line4);

    return lanes;
  };

  const renderMarkers = () => {
    const markerGeometry = new THREE.SphereGeometry(0.75, 64, 64);
    const markerMaterial = new THREE.MeshStandardMaterial({
      color: 0xae38fb,
    });

    const marker1 = new THREE.Mesh(markerGeometry, markerMaterial);
    const marker2 = new THREE.Mesh(markerGeometry, markerMaterial);
    const marker3 = new THREE.Mesh(markerGeometry, markerMaterial);
    const marker4 = new THREE.Mesh(markerGeometry, markerMaterial);
    marker1.position.x = -3;
    marker1.position.z = 40;
    marker2.position.x = -1;
    marker2.position.z = 40;
    marker3.position.x = 1;
    marker3.position.z = 40;
    marker4.position.x = 3;
    marker4.position.z = 40;

    const markers = new THREE.Group();
    markers.add(marker1, marker2, marker3, marker4);

    return markers;
  };

  const renderCurrentSong = () => {
    const lanes = renderLanes();
    const markers = renderMarkers();

    const noteGeometry = new THREE.SphereGeometry(0.7, 64, 64);
    const noteMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbae38,
    });

    const notes = new THREE.Group();
    notes.position.z = 50;

    const notesData = currentSong.notes;

    const bpm = currentSong.bpm;
    const bps = bpm / 60;
    let distance = 100;
    let animationTime = 10;
    const step = distance / (bps * animationTime);

    const lanesPositions = [-3, -1, 1, 3];
    let notesSize = 0;
    for (let noteData of notesData) {
      const note = new THREE.Mesh(noteGeometry, noteMaterial);
      note.position.x = lanesPositions[noteData.lane - 1];
      const noteDistance = step * noteData.time;
      note.position.z -= noteDistance;
      notesSize += noteDistance;
      animationTime += noteData.time;
      notes.add(note);
    }

    const animate = () => {
      distance += notesSize;
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
    async render(scene: THREE.Scene) {
      await loadSong(SONGS[0]);
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
