import * as THREE from "three";

export const videoTexture = async () => {
  const video = document.createElement("video");
  video.src = "video.mp4";

  const promise = new Promise((resolve) => {
    video.addEventListener("loadeddata", () => {
      resolve(true);
    });
  });

  await Promise.all([promise]);

  const texture = new THREE.VideoTexture(video);

  const aspectRatio = video.videoWidth / video.videoHeight;
  // const geometry = new THREE.PlaneGeometry(10, 10, 128, 128);
  // const geometry = new THREE.SphereGeometry(5, 128, 128);
  const boxSize = 10;
  const geometry = new THREE.BoxGeometry(
    boxSize,
    boxSize / aspectRatio,
    boxSize,
    128,
    128
  );
  const material = new THREE.MeshStandardMaterial({
    map: texture,
  });
  material.side = THREE.FrontSide;

  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.x = -1;

  return {
    mesh,
    video,
    geometry,
    material,
  };
};
