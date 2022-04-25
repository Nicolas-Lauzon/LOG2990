import { Injectable } from '@angular/core';
import { DrawStrategyService } from 'src/app/services/draw-strategy/draw-strategy';
import { DrawingService } from 'src/app/services/drawing-service/drawing.service';
import { ColorService } from '../../color-service/color-service.service';
import { DataService } from '../../data-service/data.service';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { GridService } from '../../grid-service/grid.service';
const PERCENTAGE = 100;
const MIN_TOLERANCE = 0;

@Injectable({
  providedIn: 'root'
})
export class DrawStrategyBucketService implements DrawStrategyService {
  private canvas: HTMLCanvasElement;
  currentId: number;
  tolerance: number;
  private services: {drawingService: DrawingService,
                     dataService: DataService,
                     colorService: ColorService,
                     drawInvoker: DrawInvokerService,
                     gridService: GridService};
  private size: [number, number][];
  private newCanvas: HTMLCanvasElement;

  constructor(drawingService: DrawingService,
              dataService: DataService,
              colorService: ColorService,
              drawInvoker: DrawInvokerService,
              gridService: GridService) {
    this.size = new Array<[number, number]>();
    this.services = {drawingService, dataService, colorService, drawInvoker, gridService};
    this.currentId = 0;
    this.tolerance = MIN_TOLERANCE;

  }
  onSelected(): void {
    let width = 0;
    let height = 0;
    this.services.dataService.dimensionXCurrent.subscribe((message) => (width = message));
    this.services.dataService.dimensionYCurrent.subscribe((message) => (height = message));
    this.canvas = document.createElement('canvas');
    this.newCanvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.newCanvas.width = width;
    this.newCanvas.height = height;

    this.transformToCanvas();
    }

  onMouseMovement(event: MouseEvent): [string, string] {
    return ['', ''];
  }
  onMouseDown(event: MouseEvent, eventButton: number): [string, string] {
    const redStart = 1;
    const redEnd = 3;
    const greenStart = 3;
    const greenEnd = 5;
    const blueStart = 5;
    const blueEnd = 7;
    const alphaStart = 7;
    const alphaEnd = 9;
    const red = this.transformToNumber(this.services.colorService.getPrimaryColor().substring(redStart, redEnd));
    const green = this.transformToNumber(this.services.colorService.getPrimaryColor().substring(greenStart, greenEnd));
    const blue = this.transformToNumber(this.services.colorService.getPrimaryColor().substring(blueStart, blueEnd));
    const alpha = this.transformToNumber(this.services.colorService.getPrimaryColor().substring(alphaStart, alphaEnd));
    const array = new Uint8ClampedArray([red, green, blue, alpha]);

    const canvas = this.floodFill(this.canvas, event.offsetX, event.offsetY, array);
    const result: [string, string] = this.tagReturner(canvas);
    this.currentId++;

    this.services.drawInvoker.do([[result[0], result[1], '']]);

    return ['', ''];
  }

  onMouseUp(event: MouseEvent): [string, string] {
    this.transformToCanvas();
    return ['', ''];

  }

  onMouseOut(event: MouseEvent): [string, string] {
    return ['', ''];  }

  onBackspace(event: MouseEvent): [string, string] {
    return ['', ''];  }
  onEscape(event: MouseEvent): [string, string] {
    return ['', ''];  }

  onCtrlKey(event: KeyboardEvent): [string, string] {
    return ['', ''];  }

  onShiftDown(event: MouseEvent): [string, string] {
    return ['', ''];  }

  onShiftUp(event: MouseEvent): [string, string] {
    return ['', ''];  }

  getCurrentId(): number {
    return this.currentId;
  }

  setCurrentId(receivedId: number): void {
    this.currentId = receivedId;
  }

  private transformToCanvas(): void {

      const mainFrameCopy = ((this.services.drawingService.svg as SVGElement).cloneNode(true)) as HTMLElement;
      if (this.services.gridService.isActive) {
      (mainFrameCopy.querySelector('#grid') as HTMLElement).innerHTML = '';
    }
      const img = document.createElement('img');
      const xml = new XMLSerializer().serializeToString(mainFrameCopy);
      const DOMURL = self.URL || self;
      const svg = new Blob([xml], {type: 'image/svg+xml;charset=utf-8'});
      const url = DOMURL.createObjectURL(svg);
      img.src = url;
      img.onload = () => {
        (this.canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(img, 0, 0);
        const png = this.canvas.toDataURL('image/png');
        DOMURL.revokeObjectURL(png);
      };

  }
  // inspired by https://en.wikipedia.org/wiki/Flood_fill
  private floodFill(canvas: HTMLCanvasElement, posX: number, posY: number, color: Uint8ClampedArray): HTMLCanvasElement {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const ctxFinal = this.newCanvas.getContext('2d') as CanvasRenderingContext2D;
    const colorToFill = ctx.getImageData(posX, posY, 1, 1).data;

    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const finalImageData = ctxFinal.getImageData(0, 0, ctxFinal.canvas.width, ctxFinal.canvas.height);
    const pixelsToCheck = new Array<[number, number]>();
    pixelsToCheck.push([posX, posY]);
    const nColors = 4;
    const maxColor = this.getMaxColor(colorToFill);
    const minColor = this.getMinColor(colorToFill);
    const coordX: number[] = new Array<number>(2);
    const coordY: number[] = new Array<number>(2);
    coordX[0] = posX;
    coordX[1] = posX;
    coordY[0] = posY;
    coordY[1] = posY;
    const offset = ((posY * imageData.width + posX) * nColors);
    if  (this.compareColors(imageData.data, color, offset, 0)) {

      return document.createElement('canvas');
    }
    while (pixelsToCheck.length > 0) {
      const newPos = pixelsToCheck.pop() as [number, number];
      const offsetRight = (newPos[1] * imageData.width + (newPos[0] + 1)) * nColors;
      const offsetLeft = (newPos[1] * imageData.width + (newPos[0] - 1)) * nColors;
      const offsetTop = ((newPos[1] + 1) * imageData.width + newPos[0]) * nColors;
      const offsetBottom = ((newPos[1] - 1) * imageData.width + newPos[0]) * nColors;
      if (this.checkValidity(newPos[0] + 1, newPos[1], imageData.data, offsetRight, colorToFill,
        canvas.width, canvas.height, maxColor, minColor)) {
        pixelsToCheck.push([newPos[0] + 1, newPos[1]]);
        this.setColor(newPos[0] + 1, newPos[1], color, imageData, finalImageData);
      }
      if (this.checkValidity(newPos[0] - 1, newPos[1], imageData.data, offsetLeft, colorToFill,
         canvas.width, canvas.height, maxColor, minColor)) {
        pixelsToCheck.push([newPos[0] - 1, newPos[1]]);
        this.setColor(newPos[0] - 1, newPos[1], color, imageData, finalImageData);

      }
      if (this.checkValidity(newPos[0], newPos[1] + 1, imageData.data, offsetTop, colorToFill,
         canvas.width, canvas.height, maxColor, minColor)) {
        pixelsToCheck.push([newPos[0], newPos[1] + 1]);
        this.setColor(newPos[0], newPos[1] + 1, color, imageData, finalImageData);

      }
      if (this.checkValidity(newPos[0], newPos[1] - 1, imageData.data, offsetBottom, colorToFill,
         canvas.width, canvas.height, maxColor, minColor)) {
        pixelsToCheck.push([newPos[0], newPos[1] - 1]);
        this.setColor(newPos[0], newPos[1] - 1, color, imageData, finalImageData);

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
    const width = this.size[0][1] - this.size[0][0];
    const height = this.size[1][1] - this.size[1][0];
    ctxFinal.putImageData(finalImageData, 0, 0);
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    const newContext = resizedCanvas.getContext('2d') as CanvasRenderingContext2D;
    newContext.drawImage(this.newCanvas, this.size[0][0], this.size[1][0], width, height, 0, 0, width, height);
    return resizedCanvas;
  }

  private checkValidity(posX: number,
                        posY: number,
                        imageData: Uint8ClampedArray,
                        offset: number,
                        colorToFill: Uint8ClampedArray,
                        maxX: number,
                        maxY: number,
                        maxColor: Uint8ClampedArray,
                        minColor: Uint8ClampedArray): boolean {
    const outOfBounds = posX > 0 && posY > 0 && posX < maxX && posY < maxY;
    if (this.checkInterval(imageData, colorToFill, offset, maxColor, minColor) &&
        outOfBounds &&
        (this.compareColors(imageData, colorToFill, offset, 0))) {
      return true;
    } else {
      return false;
    }
  }
  setColor(posX: number, posY: number, color: Uint8ClampedArray, imageData: ImageData, finalImageData: ImageData): void {
    const nColors = 4;
    let index = 0;
    const offset = (posY * imageData.width + posX) * nColors;
    imageData.data[offset + index] = color[index++];
    imageData.data[offset + index] = color[index++];
    imageData.data[offset + index] = color[index++];
    imageData.data[offset + index] = color[index++];
    index = 0;
    finalImageData.data[offset + index] = color[index++];
    finalImageData.data[offset + index] = color[index++];
    finalImageData.data[offset + index] = color[index++];
    finalImageData.data[offset + index] = color[index++];

  }

  private transformToNumber(str: string): number {
    return parseInt(str, 16);
  }
  private assembleResult(canvas: HTMLCanvasElement): string {

    const result = '<image href="' +
    canvas.toDataURL() +
    '" class="primary bucket" x="' +
    this.size[0][0] + '" y="' +
    this.size[1][0] +
    '"></image>';

    return result;
  }
  private tagReturner(canvas: HTMLCanvasElement): [string, string] {
    const result = this.assembleResult(canvas);
    const width = this.size[0][1] - this.size[0][0];
    const height = this.size[1][1] - this.size[1][0];
    return ['bucket' + this.currentId, '<g id="bucket' + this.currentId + '" x="' +
    this.size[0][0] + '" y="' +
    this.size[1][0] + '" width="' + width + '" height="' + height + '"> ' + result + '</g>'];
  }
  private checkInterval(pixelColor: Uint8ClampedArray,
                        colorToFill: Uint8ClampedArray,
                        index: number,
                        maxColor: Uint8ClampedArray,
                        minColor: Uint8ClampedArray): boolean {

    for (let i = 0; i < colorToFill.length - 1; i++) {
      if (pixelColor[index + i] > maxColor[i] || pixelColor[index + i] < minColor[i]) {
        return false;
      }
    }
    return true;
  }

  private getMinColor(colorToFill: Uint8ClampedArray): Uint8ClampedArray {
    const minColor = colorToFill.slice();
    for (let i = 0; i < minColor.length - 1; i++) {
      minColor[i] = minColor[i] - (this.tolerance / PERCENTAGE * minColor[i]);
    }

    return minColor;

  }
  private getMaxColor(colorToFill: Uint8ClampedArray): Uint8ClampedArray {
    const maxColor = colorToFill.slice();
    for (let i = 0; i < maxColor.length - 1; i++) {
      maxColor[i] = maxColor[i] + (this.tolerance / PERCENTAGE * maxColor[i]);

    }
    return maxColor;
  }
  private compareColors(color1: Uint8ClampedArray, color2: Uint8ClampedArray, index1: number, index2: number): boolean {
    for (let i = 0; i < color2.length - 1; i++) {
      if (color1[index1 + i] !== color2[index2 + i]) {
        return false;
      }
    }
    return true;
  }
}
