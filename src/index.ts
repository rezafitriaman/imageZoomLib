import "./index.hbs";
import "./index.scss";
import { ZoomImage } from './zoom'

//TODO make docker 
const img = document.querySelector("#myimage")! as HTMLImageElement;
const result = document.querySelector("#myresult")! as HTMLImageElement;

const marvelZoom = new ZoomImage(img, result, true);
marvelZoom.init();

/* if (module.hot) {
  module.hot.accept("./zoom.ts", function () {
    console.warn("Accepting the updated ZoomImage module!");
    new ZoomImage(img, result, true).init();
  });
} */