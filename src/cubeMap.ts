import * as THREE from "three";

const getCellMapPosition = (cell: string, direction = "vertical") => {
  if (direction === "vertical") {
    switch (cell) {
      case "0_1":
        return "py";
      case "1_0":
        return "nx";
      case "1_1":
        return "pz";
      case "1_2":
        return "px";
      case "2_1":
        return "ny";
      case "3_1":
        return "nz";
      default:
        return "";
    }
  }

  return "";
};

const createVerticalMap = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  const numColumns = 3;
  const numRows = 4;

  const tileHeight = canvas.height / numRows;
  const tileWidth = tileHeight;
  let tiles = new Map();

  for (let i = 0; i < numColumns; i++) {
    for (let j = 0; j < numRows; j++) {
      const posX = i * tileWidth;
      const posY = j * tileHeight;
      const tile = context.getImageData(posX, posY, tileWidth, tileHeight);
      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = tileWidth;
      tileCanvas.height = tileHeight;
      const tileCanvasContext = tileCanvas.getContext(
        "2d"
      ) as CanvasRenderingContext2D;
      tileCanvasContext.putImageData(tile, 0, 0);
      const currentCell = `${j}_${i}`;
      const cellPosition = getCellMapPosition(currentCell);

      tiles.set(cellPosition || currentCell, {
        canvas: tileCanvas,
        position: [posX, posY],
      });
    }
  }

  return tiles;
};

export const cubeMap = async (canvas: HTMLCanvasElement) => {
  // const canvas = document.createElement("canvas");
  // const image = new Image();

  // const promise = new Promise((resolve) => {
  //   image.onload = () => {
  //     resolve(true);
  //   };
  // });
  // image.src = "bg.jpg";

  // await Promise.all([promise]);

  // canvas.width = image.width;
  // canvas.height = image.height;

  // const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  // context.drawImage(image, 0, 0);

  const tiles = createVerticalMap(canvas);

  const images: HTMLCanvasElement[] = [
    tiles.get("px").canvas,
    tiles.get("nx").canvas,
    tiles.get("py").canvas,
    tiles.get("ny").canvas,
    tiles.get("pz").canvas,
    tiles.get("nz").canvas,
  ];

  return {
    images,
  };
};
