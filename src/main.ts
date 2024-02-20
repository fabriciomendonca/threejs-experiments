import "./style.css";
import { createRenderer } from "./renderer";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    
  </div>
`;

const init = () => {
  const renderer = createRenderer(
    document.querySelector(".container") as HTMLDivElement
  );

  renderer.start();
  // renderer.renderCapoeiraModel();
  // renderer.renderSphere();
  // renderer.renderTargetTexture();
  // renderer.renderVideoTexture();
  // renderer.renderCubeMap();
  // renderer.renderDisplacementTest();
  // renderer.renderParticleTests();
  renderer.renderGuitarHero();
};

init();
