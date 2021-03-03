import "./index.hbs";
import "./index.scss";
// import { printMe } from './print'

/* if (module.hot) {
  module.hot.accept("./print.js", function () {
    console.warn("Accepting the updated printMe module!");
    printMe();
  });
} */

const img = document.querySelector("#myimage")! as HTMLImageElement;
const result = document.querySelector("#myresult")! as HTMLImageElement;
class ZoomImage {
  protected originImgElm: HTMLImageElement;
  protected resultImgElm: HTMLImageElement;
  protected lens: HTMLElement;
  protected scaleDown: number;
  protected center: boolean | undefined;

  constructor(originImgElm: HTMLImageElement, resultImgElm: HTMLImageElement, center?: boolean) {
    this.scaleDown = 6;
    this.originImgElm = originImgElm;
    this.resultImgElm = resultImgElm;
    this.lens = document.createElement("div");
    this.center = center;
  }
  createLens() {
    const create = () => {
      const originImgElmWidth = this.originImgElm!.getBoundingClientRect().width;
      const originImgElmHeight = this.originImgElm!.getBoundingClientRect().height;
      const originImgElmWidth_scaledDown = originImgElmWidth / this.scaleDown;
      const originImgElmHeight_scaledDown = originImgElmHeight / this.scaleDown;

      this.lens.setAttribute("class", "img-zoom-lens"); 
      this.lens.style.width = `${originImgElmWidth_scaledDown}px`;
      this.lens.style.height = `${originImgElmHeight_scaledDown}px`;

      this.originImgElm.parentElement!.insertBefore(
        this.lens,
        this.originImgElm
      );
      
      if(this.center) {
        this.lens.style.left = `${(originImgElmWidth / 2 ) - (originImgElmWidth_scaledDown / 2)}px`;
        this.lens.style.top = `${(originImgElmHeight / 2 ) - (originImgElmHeight_scaledDown / 2 )}px`;
      }
    };

    if (this.originImgElm!.getBoundingClientRect().width === 0 ||
      this.originImgElm!.getBoundingClientRect().height === 0) {
      this.originImgElm!.addEventListener("load", () => {
        create();
      });
    } else {
      create();
    }
  }
  createResult() {
    const create = () => {
      const resultWidth = this.originImgElm.getBoundingClientRect().width;
      const resultHeight = this.originImgElm.getBoundingClientRect().height;
      const cx = resultWidth / this.lens.getBoundingClientRect().width;
      const cy = resultHeight / this.lens.getBoundingClientRect().height;
      const resultWidthElmWidth_scaledDown = resultWidth / this.scaleDown;
      const resultWidthElmHeight_scaledDown = resultHeight / this.scaleDown;

      this.resultImgElm.style.width = `${resultWidth}px`;
      this.resultImgElm.style.height = `${resultHeight}px`;
      this.resultImgElm.style.backgroundImage = `url(${this.originImgElm.src})`;
      this.resultImgElm.style.backgroundSize = `${this.originImgElm.width * cx}px ${this.originImgElm.height * cy}px`;

      if(this.center) {
        result.style.backgroundPosition = `-${((resultWidth / 2 ) - (resultWidthElmWidth_scaledDown / 2)) * cx}px -${((resultHeight / 2 ) - (resultWidthElmHeight_scaledDown / 2 )) * cy}px `;
      }
    };

    if (this.originImgElm!.getBoundingClientRect().width === 0 ||
      this.originImgElm!.getBoundingClientRect().height === 0) {
      this.originImgElm!.addEventListener("load", () => {
        create();
      });
    } else {
      create();
    }
  }
  getCursorPos = (event: MouseEvent | TouchEvent) => {
    let cursorX = 0;
    let cursorY = 0;
    let cursorPage_X_Post: number = (event as MouseEvent).pageX || (event as TouchEvent).changedTouches && (event as TouchEvent).changedTouches[0].pageX;
    let cursorPage_Y_Post: number = (event as MouseEvent).pageY || (event as TouchEvent).changedTouches && (event as TouchEvent).changedTouches[0].pageY;
    let originImgElm_lefTop_Post = this.originImgElm.getBoundingClientRect();
    
    cursorX = cursorPage_X_Post - originImgElm_lefTop_Post.left;
    cursorY = cursorPage_Y_Post - originImgElm_lefTop_Post.top;
    cursorX = cursorX - window.pageXOffset;
    cursorY = cursorY - window.pageYOffset;

    return { cursorX: cursorX, cursorY: cursorY };
  };

  moveLens(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    const cursorPos = this.getCursorPos(event);
    const lensWidth = this.lens.offsetWidth;
    const lensHeight = this.lens.offsetHeight;
    let cursorX = cursorPos.cursorX - lensWidth / 2;
    let cursorY = cursorPos.cursorY - lensHeight / 2;
    const resultWidth = this.resultImgElm.getBoundingClientRect().width;
    const resultHeight = this.resultImgElm.getBoundingClientRect().height;
    const originImgElmWidth = this.originImgElm.width;
    const originImgElmHeight = this.originImgElm.height; 
    const cx = resultWidth / this.lens.getBoundingClientRect().width;
    const cy = resultHeight / this.lens.getBoundingClientRect().height;
    
    // TODO make this better
    if (cursorX > originImgElmWidth - lensWidth) {
      cursorX = originImgElmWidth - lensWidth;
    }else if(cursorX < 0) {
      cursorX = 0;
    }

    if (cursorY > originImgElmHeight - lensHeight) {
      cursorY = originImgElmHeight - lensHeight;
    } else if(cursorY < 0) {
      cursorY = 0;
    }

    this.lens.style.left = `${cursorX}px`;
    this.lens.style.top = `${cursorY}px`;

    result.style.backgroundPosition = `-${cursorX * cx}px -${cursorY * cy}px `;
  }
  init() {
    this.createLens();
    this.createResult();

    this.lens.addEventListener("mousemove", (event) => {
      this.moveLens(event);
    });
    this.originImgElm.addEventListener("mousemove", (event) => {
      this.moveLens(event);
    });
    this.lens.addEventListener("touchmove", (event) => {
      this.moveLens(event);
    });
    this.originImgElm.addEventListener("touchmove", (event) => {
      this.moveLens(event);
    });
  }
}

const marvelZoom = new ZoomImage(img, result, true);
marvelZoom.init();
