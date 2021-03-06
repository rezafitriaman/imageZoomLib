import "./index.hbs";
import "./index.scss";
import { ZoomImage } from './zoom'

const img = document.querySelector("#myimage")! as HTMLImageElement;
const result = document.querySelector("#myresult")! as HTMLImageElement;

const marvelZoom = new ZoomImage(img, result, true);
marvelZoom.init();