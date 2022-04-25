import { Injectable } from '@angular/core';
import { DataService } from '../../data-service/data.service';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawingService } from '../../drawing-service/drawing.service';
import { DrawStrategyService } from '../draw-strategy';
import { ColorService } from './../../color-service/color-service.service';
enum SERVICE_INDEX {COLOR_SERVICES, INVOKER, DRAWING, DATA}
@Injectable({
  providedIn: 'root'
})
export class DrawStrategyColorApplicatorService implements DrawStrategyService {

  private isClicked: boolean;
  private button: number;
  private commandGroup: [string, string, string][];
  private canClick: boolean;
  private canvas: HTMLCanvasElement[];
  private size: [number, number][];
  private services: [ColorService, DrawInvokerService, DrawingService, DataService];

  constructor(colorService: ColorService, drawingInvoker: DrawInvokerService, drawingService: DrawingService, dataService: DataService) {
    this.canvas = new Array<HTMLCanvasElement>(2);
    this.canClick = true;
    this.services = [colorService, drawingInvoker, drawingService, dataService];
    this.size = new Array<[number, number]>();
    this.isClicked = false;
    this.button = 0;
    this.commandGroup = [];
   }
  setCurrentId(receivedId: number): void {
    return;
  }
  onMouseMovement(event: MouseEvent): [string, string] {

    if (this.isClicked) {
      this.makeChanges(event, this.button);
 }

    return ['', ''];
  }
  onSelected(): void {
    let width = 0;
    let height = 0;
    this.services[SERVICE_INDEX.DATA].dimensionXCurrent.subscribe((message) => (width = message));
    this.services[SERVICE_INDEX.DATA].dimensionYCurrent.subscribe((message) => (height = message));
    this.canvas[0] = document.createElement('canvas');
    this.canvas[1] = document.createElement('canvas');
    this.canvas[1].width = width;
    this.canvas[1].height = height;
    this.canvas[0].width = width;
    this.canvas[0].height = height;
    this.transformToCanvas();
  }
  onMouseDown(event: MouseEvent, eventButton: number): [string, string] {
    if (!this.canClick) {
      return ['', ''];
    }
    this.makeChanges(event, this.button);
    this.isClicked = true;
    this.button = eventButton;

    return ['', ''];
  }
  onMouseUp(event: MouseEvent): [string, string] {
    if (this.canClick) {
      this.canClick = false;
      const DELAY = 500;
      setTimeout(() => {this.canClick = true; }, DELAY);
    } else {
      return ['', ''];
    }
    this.isClicked = false;
    this.services[SERVICE_INDEX.INVOKER].do(this.commandGroup);
    this.commandGroup = [];
    this.transformToCanvas();
    return ['', ''];
  }
  onMouseOut(event: MouseEvent): [string, string] {
    this.onMouseUp(event);
    return ['', ''];
  }
  onBackspace(event: MouseEvent): [string, string] {
    return ['', ''];
  }
  onEscape(event: MouseEvent): [string, string] {
    return ['', ''];
  }
  onCtrlKey(event: KeyboardEvent): [string, string] {
    return ['', ''];
  }
  onShiftDown(event: MouseEvent): [string, string] {
    return ['', ''];
  }
  onShiftUp(event: MouseEvent): [string, string] {
    return ['', ''];
  }
  private transformToCanvas(): void {

    const img = document.createElement('img');
    const xml = new XMLSerializer().serializeToString(this.services[SERVICE_INDEX.DRAWING].svg as SVGSVGElement);
    const DOMURL = self.URL || self;
    const svg = new Blob([xml], {type: 'image/svg+xml;charset=utf-8'});
    const url = DOMURL.createObjectURL(svg);
    img.src = url;
    img.onload = () => {
      (this.canvas[0].getContext('2d') as CanvasRenderingContext2D).drawImage(img, 0, 0);
      const png = this.canvas[0].toDataURL('image/png');
      DOMURL.revokeObjectURL(png);
    };

}
  private makeChanges(event: MouseEvent, button: number): void {
    const target = event.target as HTMLElement;
    const targetP = target.parentElement as HTMLElement;
    this.changeFill(button, targetP, event);
    this.changeStroke(button, targetP);
  }
  private changeStroke(button: number, target: HTMLElement): void {
    if (button === 2) {
      const childs = target.children;
      for (const child of Array.from(childs)) {
        if (child.classList.contains('secondary')) {
          const command: [string, string, string] = [target.id, '', target.outerHTML];
          if (child.classList.contains('fill')) {
            child.setAttribute('fill', this.services[SERVICE_INDEX.COLOR_SERVICES].getSecondaryColor());
          }
          if (child.classList.contains('contour')) {
            child.setAttribute('stroke', this.services[SERVICE_INDEX.COLOR_SERVICES].getSecondaryColor());
          }
          command[1] = target.outerHTML;
          this.commandGroup.push(command);
        }
      }
    }
  }
  private changeFill(button: number, target: HTMLElement, event: MouseEvent): void {
    if (button === 0) {

      const childs = target.children;
      for (const child of Array.from(childs)) {
        if (child.classList.contains('primary')) {

          const command: [string, string, string] = [target.id, '' , target.outerHTML];
          if (child.classList.contains('fill')) {
            child.setAttribute('fill', this.services[SERVICE_INDEX.COLOR_SERVICES].getPrimaryColor());
          }
          if (child.classList.contains('contour')) {
            child.setAttribute('stroke', this.services[SERVICE_INDEX.COLOR_SERVICES].getPrimaryColor());
          }
          if (child.classList.contains('bucket')) {
            let width = 0;
            this.services[SERVICE_INDEX.DATA].dimensionXCurrent.subscribe((message) => {
              width = message;
            });

            let height = 0;
            this.services[SERVICE_INDEX.DATA].dimensionYCurrent.subscribe((message) => {
              height = message;
            });

            const svgElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgElem.setAttribute('version', '1.1');
            svgElem.setAttribute('baseProfile', 'full');
            svgElem.setAttribute('width', width.toString());
            svgElem.setAttribute('height', height.toString());
            svgElem.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svgElem.appendChild(target.cloneNode(true) as SVGImageElement);

            const img = document.createElement('img');
            const xml = new XMLSerializer().serializeToString(svgElem);
            const DOMURL = self.URL || self;
            const svg = new Blob([xml], {type: 'image/svg+xml;charset=utf-8'});
            const url = DOMURL.createObjectURL(svg);
            img.src = url;
            const newCanvas = document.createElement('canvas');
            newCanvas.width = Number(target.getBoundingClientRect().right - target.getBoundingClientRect().left);
            newCanvas.height = Number(target.getBoundingClientRect().bottom - target.getBoundingClientRect().top);
            img.onload = () => {
              (this.canvas[1].getContext('2d') as CanvasRenderingContext2D).drawImage(img, 0, 0);
              const png = this.canvas[1].toDataURL('image/png');
              DOMURL.revokeObjectURL(png);
              this.floodFill(this.canvas[1], event.offsetX, event.offsetY, this.getColorInArray());

              const newContext = newCanvas.getContext('2d') as CanvasRenderingContext2D;
              newContext.drawImage(this.canvas[1], this.size[0][0], this.size[1][0], width, height, 0, 0, width, height);

              const newImage = newCanvas.toDataURL();

              const newChild = document.createElementNS('http://www.w3.org/2000/svg', 'image');
              newChild.setAttribute('href', newImage);
              newChild.setAttribute('x', this.size[0][0].toString());
              newChild.setAttribute('y', this.size[1][0].toString());
              newChild.setAttribute('class', 'primary bucket');
              target.setAttribute('transform', '');
              target.setAttribute('x', this.size[0][0].toString());
              target.setAttribute('y', this.size[1][0].toString());
              const oldParent = target.outerHTML;

              target.appendChild(newChild);
              target.removeChild(child);
              this.services[SERVICE_INDEX.INVOKER].do([[(target as HTMLElement).id, (target as HTMLElement).outerHTML, oldParent]]);
            };
            return;
          }
          command[1] = target.outerHTML;
          this.commandGroup.push(command);
        }
      }
    }
  }

  private floodFill(canvas: HTMLCanvasElement, posX: number, posY: number, color: Uint8ClampedArray): void {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const colorToFill = ctx.getImageData(posX, posY, 1, 1).data;

    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const pixelsToCheck = new Array<[number, number]>();
    pixelsToCheck.push([posX, posY]);
    const nColors = 4;
    const coordX: number[] = new Array<number>(2);
    const coordY: number[] = new Array<number>(2);
    coordX[0] = posX;
    coordX[1] = posX;
    coordY[0] = posY;
    coordY[1] = posY;
    const offset = ((posY * imageData.width + posX) * nColors);
    if  (this.compareColors(imageData.data, color, offset, 0)) {

      return ;
    }
    while (pixelsToCheck.length > 0) {
      const newPos = pixelsToCheck.pop() as [number, number];
      const offsetRight = (newPos[1] * imageData.width + (newPos[0] + 1)) * nColors;
      const offsetLeft = (newPos[1] * imageData.width + (newPos[0] - 1)) * nColors;
      const offsetTop = ((newPos[1] + 1) * imageData.width + newPos[0]) * nColors;
      const offsetBottom = ((newPos[1] - 1) * imageData.width + newPos[0]) * nColors;
      if (this.checkValidity(newPos[0] + 1, newPos[1], imageData.data, offsetRight, colorToFill,
        canvas.width, canvas.height, color)) {
        pixelsToCheck.push([newPos[0] + 1, newPos[1]]);
        this.setColor(newPos[0] + 1, newPos[1], color, imageData);
      }
      if (this.checkValidity(newPos[0] - 1, newPos[1], imageData.data, offsetLeft, colorToFill,
         canvas.width, canvas.height, color)) {
        pixelsToCheck.push([newPos[0] - 1, newPos[1]]);
        this.setColor(newPos[0] - 1, newPos[1], color, imageData);

      }
      if (this.checkValidity(newPos[0], newPos[1] + 1, imageData.data, offsetTop, colorToFill,
         canvas.width, canvas.height, color)) {
        pixelsToCheck.push([newPos[0], newPos[1] + 1]);
        this.setColor(newPos[0], newPos[1] + 1, color, imageData);

      }
      if (this.checkValidity(newPos[0], newPos[1] - 1, imageData.data, offsetBottom, colorToFill,
         canvas.width, canvas.height, color)) {
        pixelsToCheck.push([newPos[0], newPos[1] - 1]);
        this.setColor(newPos[0], newPos[1] - 1, color, imageData);

      }
      if (newPos[0] < coordX[0]) {
        coordX[0] = newPos[0];
      } else if (newPos[1] < coordY[0]) {
        coordY[0] = newPos[1];
      } else if (newPos[0] > coordX[1]) {
        coordX[1] = newPos[0];
      } else if (newPos[1] > coordY[1]) {
        coordY[1] = newPos[1];
      }
    }

    this.size[0] = [coordX[0], coordX[1]];
    this.size[1] = [coordY[0], coordY[1]];
    ctx.putImageData(imageData, 0 , 0);
  }
  private checkValidity(posX: number,
                        posY: number,
                        imageData: Uint8ClampedArray,
                        offset: number,
                        colorToFill: Uint8ClampedArray,
                        maxX: number,
                        maxY: number,
                        color: Uint8ClampedArray): boolean {
const outOfBounds = posX > 0 && posY > 0 && posX < maxX && posY < maxY;
if (!this.compareColors(imageData, color, offset, 0) &&
outOfBounds &&
(this.compareColors(imageData, colorToFill, offset, 0))) {
return true;
} else {
return false;
}
}
  getColorInArray(): Uint8ClampedArray {
    const redStart = 1;
    const redEnd = 3;
    const greenStart = 3;
    const greenEnd = 5;
    const blueStart = 5;
    const blueEnd = 7;
    const alphaStart = 7;
    const alphaEnd = 9;
    const red = this.transformToNumber(this.services[SERVICE_INDEX.COLOR_SERVICES].getPrimaryColor().substring(redStart, redEnd));
    const green = this.transformToNumber(this.services[SERVICE_INDEX.COLOR_SERVICES].getPrimaryColor().substring(greenStart, greenEnd));
    const blue = this.transformToNumber(this.services[SERVICE_INDEX.COLOR_SERVICES].getPrimaryColor().substring(blueStart, blueEnd));
    const alpha = this.transformToNumber(this.services[SERVICE_INDEX.COLOR_SERVICES].getPrimaryColor().substring(alphaStart, alphaEnd));
    const array = new Uint8ClampedArray([red, green, blue, alpha]);
    return array;
  }
  getCurrentId(): number {
    return 0;
  }
  private compareColors(color1: Uint8ClampedArray, color2: Uint8ClampedArray, index1: number, index2: number): boolean {
    const TRANSPARENCY_OFFSET = 3;
    if (color1[index1 + TRANSPARENCY_OFFSET] === 0) {
      return false;
    }
    for (let i = 0; i < color2.length - 1; i++) {
      if (color1[index1 + i] !== color2[index2 + i]) {
        return false;
      }
    }
    return true;
  }
  setColor(posX: number, posY: number, color: Uint8ClampedArray, imageData: ImageData): void {
    const PIXEL_OFFSET = 4;
    const TRANSPARENCY_OFFSET = 3;
    const offset = (posY * imageData.width + posX) * PIXEL_OFFSET;
    imageData.data[offset + 0] = color[0];
    imageData.data[offset + 1] = color[1];
    imageData.data[offset + 2] = color[2];
    imageData.data[offset + TRANSPARENCY_OFFSET] = color[TRANSPARENCY_OFFSET];

  }
  private transformToNumber(str: string): number {
    return parseInt(str, 16);
  }
}
