
type CursorPos = { cursorX: number; cursorY: number };
enum BorderX {
    Right,
    Left,
    None,
  }

enum BorderY {
  Bottom,
  Top,
  None,
}
export class ZoomImage {
  protected originImgElm: HTMLImageElement;
  protected resultImgElm: HTMLImageElement;
  protected lens: HTMLElement;
  protected scaleDown: number;
  protected center: boolean | undefined;

  constructor (
    originImgElm: HTMLImageElement,
    resultImgElm: HTMLImageElement,
    center?: boolean | undefined
  ) {
    this.scaleDown = 6;
    this.originImgElm = originImgElm;
    this.resultImgElm = resultImgElm;
    this.lens = document.createElement("div");
    this.center = center;
  }
  createLens() {
    const create = () => {
      const originImgElmWidth: number = this.originImgElm!.getBoundingClientRect().width;
      const originImgElmHeight: number = this.originImgElm!.getBoundingClientRect().height;
      const originImgElmWidth_scaledDown: number = originImgElmWidth / this.scaleDown;
      const originImgElmHeight_scaledDown: number = originImgElmHeight / this.scaleDown;

      this.lens.setAttribute("class", "img-zoom-lens");
      this.lens.style.width = `${originImgElmWidth_scaledDown}px`;
      this.lens.style.height = `${originImgElmHeight_scaledDown}px`;
      this.originImgElm.parentElement!.insertBefore(
        this.lens,
        this.originImgElm
      );

      if (this.center) {
        this.lens.style.left = `${
          originImgElmWidth / 2 - originImgElmWidth_scaledDown / 2
        }px`;
        this.lens.style.top = `${
          originImgElmHeight / 2 - originImgElmHeight_scaledDown / 2
        }px`;
      } 
    };

    this.ifImgOriginLoaded(create);
  }
  ifImgOriginLoaded(create: Function): Function {
    let isLoaded: boolean = this.originImgElm!.complete && this.originImgElm!.naturalHeight !== 0;

  
    if (!this.originImgElm!.complete && this.originImgElm!.naturalHeight !== 0) {
      this.originImgElm!.addEventListener("load", () => {
        console.log(this.originImgElm!.naturalHeight)
        console.log('bb', this.originImgElm!.complete && this.originImgElm!.naturalHeight !== 0)
        if (!this.originImgElm!.complete && this.originImgElm!.naturalHeight !== 0) {
          console.log( 'cc', this.originImgElm!.complete && this.originImgElm!.naturalHeight !== 0)
          let checks = setInterval(() =>{ 
            console.log('cecks')
            clearInterval(checks)
            console.log( 'dd',this.originImgElm!.complete && this.originImgElm!.naturalHeight !== 0)
            return create();
           }, 100);
        }
        
        return create();
      });
    } 
    console.log('aa', this.originImgElm!.complete && this.originImgElm!.naturalHeight !== 0)
    return create(); 
  }
  createResult(): void {
    const create = (): void => {
      const resultWidth: number = this.originImgElm!.getBoundingClientRect().width;
      const resultHeight: number = this.originImgElm!.getBoundingClientRect().height;
      const cx: number = resultWidth / (resultWidth / this.scaleDown);
      const cy: number = resultHeight / (resultHeight / this.scaleDown);
      const resultWidthElmWidth_scaledDown: number = resultWidth / this.scaleDown;
      const resultWidthElmHeight_scaledDown: number = resultHeight / this.scaleDown;

      this.resultImgElm.style.width = `${resultWidth}px`;
      this.resultImgElm.style.height = `${resultHeight}px`;
      this.resultImgElm.style.backgroundImage = `url(${this.originImgElm.src})`;
      this.resultImgElm.style.backgroundSize = `${resultWidth * cx}px ${resultHeight * cy}px`;

      if (this.center) {
        this.resultImgElm.style.backgroundPosition = 
        `-${(resultWidth / 2 - resultWidthElmWidth_scaledDown / 2) * cx}px -${(resultHeight / 2 - resultWidthElmHeight_scaledDown / 2) * cy}px `;
      }
    };

    this.ifImgOriginLoaded(create);
  }
  getCursorPos = (event: MouseEvent | TouchEvent): CursorPos => {
    let cursorX: number = 0;
    let cursorY: number = 0;
    let cursorPage_X_Post: number =
      (event as MouseEvent).pageX ||
      ((event as TouchEvent).changedTouches &&
        (event as TouchEvent).changedTouches[0].pageX);
    let cursorPage_Y_Post: number =
      (event as MouseEvent).pageY ||
      ((event as TouchEvent).changedTouches &&
        (event as TouchEvent).changedTouches[0].pageY);
    let originImgElm_lef_Post: number = this.originImgElm.getBoundingClientRect().left;
    let originImgElm_top_Post: number = this.originImgElm.getBoundingClientRect().top;

    cursorX = cursorPage_X_Post - originImgElm_lef_Post;
    cursorY = cursorPage_Y_Post - originImgElm_top_Post;
    cursorX = cursorX - window.pageXOffset;
    cursorY = cursorY - window.pageYOffset;

    return { cursorX: cursorX, cursorY: cursorY };
  };

  moveLens(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    const cursorPos: CursorPos = this.getCursorPos(event);
    const lensWidth: number = this.lens.offsetWidth;
    const lensHeight: number = this.lens.offsetHeight;
    let cursorX: number = cursorPos.cursorX - lensWidth / 2;
    let cursorY: number = cursorPos.cursorY - lensHeight / 2;
    const resultWidth: number = this.resultImgElm.getBoundingClientRect().width;
    const resultHeight: number = this.resultImgElm.getBoundingClientRect().height;
    const originImgElmWidth: number = this.originImgElm.width;
    const originImgElmHeight: number = this.originImgElm.height;
    const cx: number = resultWidth / this.lens.getBoundingClientRect().width;
    const cy: number = resultHeight / this.lens.getBoundingClientRect().height;

    let border_leftOrRight: BorderX =
      cursorX > originImgElmWidth - lensWidth
        ? BorderX.Right
        : cursorX < 0
        ? BorderX.Left
        : BorderX.None;
    let border_topOrBottom: BorderY =
      cursorY > originImgElmHeight - lensHeight
        ? BorderY.Bottom
        : cursorY < 0
        ? BorderY.Top
        : BorderY.None;

    switch (border_leftOrRight) {
      case BorderX.Right:
        cursorX = originImgElmWidth - lensWidth;
        break;
      case BorderX.Left:
        cursorX = 0;
        break;
      default:
    }

    switch (border_topOrBottom) {
      case BorderY.Bottom:
        cursorY = originImgElmHeight - lensHeight;
        break;
      case BorderY.Top:
        cursorY = 0;
        break;
      default:
    }

    this.lens.style.left = `${cursorX}px`;
    this.lens.style.top = `${cursorY}px`;
    this.resultImgElm.style.backgroundPosition = `-${cursorX * cx}px -${cursorY * cy}px `;
  }
  init(): void {
    this.createLens();
    this.createResult();
    window.addEventListener("resize", () => {
      this.createLens();
      this.createResult();
    }, false);
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
