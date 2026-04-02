const getCurrentPosition = () => {
  const promise = new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { coords } = position;

        resolve({ coords, timestamp: Date.now() });
      },
      () => void 0,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });

  return promise;
};

let ellapsedTime = 0;
let initialTime = Date.now();
let intervalToPushData = 30;
const positionData = [];
const intervalId = setInterval(async () => {
  ellapsedTime = (Date.now() - initialTime) / 1000;

  const position = await getCurrentPosition();
  positionData.push(position);
  self.postMessage("Adding", position);
  if (ellapsedTime >= intervalToPushData) {
    self.postMessage("Push position data", positionData);
    ellapsedTime = 0;
    initialTime = Date.now();
  }
}, 1000);

self.onmessage = (msg) => {
  console.log(msg);
};
