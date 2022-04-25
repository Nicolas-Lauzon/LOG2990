import { Injectable } from '@angular/core';
import { DrawingService } from 'src/app/services/drawing-service/drawing.service';
import { ColorService } from '../color-service/color-service.service';
import { DrawStrategyService } from '../draw-strategy/draw-strategy';
import { DataService } from './../data-service/data.service';
import { MOUSE_BUTTON } from './../draw-strategy/draw-strategy-selection/mouse-enum';
import { GridService } from './../grid-service/grid.service';

@Injectable({
  providedIn: 'root'
})
export class ColorPickerService implements DrawStrategyService {

  private colorService: ColorService;
  private grid: GridService;
  private dataService: DataService;

  private isclicked: boolean;
  private ctx: CanvasRenderingContext2D;
  private button: number;
  private drawing: DrawingService;

  constructor(colorService: ColorService, grid: GridService, data: DataService, drawing: DrawingService) {
    this.colorService = colorService;
    this.isclicked = false;
    this.button = 0;
    this.grid = grid;
    this.dataService = data;
    this.drawing = drawing;
  }
  // code of svgToCanvas() is coming from https://stackoverflow.com/questions/3768565/drawing-an-svg-file-on-a-html5-canvas
  private svgToCanvas(): boolean {
    let width = 0;
    let height = 0;
    this.dataService.dimensionXCurrent.subscribe((message) => (width = message));
    this.dataService.dimensionYCurrent.subscribe((message) => (height = message));

    const canvas = document.createElement('canvas');
    canvas.style.display = 'hidden';
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    const img = document.createElement('img');
    img.style.display = 'hidden';
    const load = img.onload = () => {
      this.ctx.drawImage(img, 0, 0);
      return true;
    };
    document.body.appendChild(img);

    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    const mainFrameCopy = ((this.drawing.svg as SVGElement).cloneNode(true)) as HTMLElement;
    if (this.grid.isActive) {
      (mainFrameCopy.querySelector('#grid') as HTMLElement).innerHTML = '';
    }
    const xml = new XMLSerializer().serializeToString(mainFrameCopy);
    const DOMURL = self.URL || self;
    const svg = new Blob([xml], {type: 'image/svg+xml;charset=utf-8'});
    const url = DOMURL.createObjectURL(svg);
    img.src = url;
    load();
    document.body.removeChild(canvas);
    document.body.removeChild(img);
    return false;
  }
  onSelected(): void {
    return;
  }
  private getColor(event: MouseEvent): void {
    const delay = 100;
    setTimeout(() => {
      const data = this.ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;

      const newColor = this.colorService.getColorFromArray(data);
      if (this.button === MOUSE_BUTTON.LEFT) {
        this.colorService.primaryColor = newColor;
      } else if (this.button === MOUSE_BUTTON.RIGHT) {
        this.colorService.secondaryColor = newColor;

      }
    }, delay);
  }

  onMouseMovement(event: MouseEvent): [string, string] {

    if (this.isclicked) {
      this.getColor(event);
    }
    return ['', ''];
  }
  onMouseDown(event: MouseEvent, eventButton: number): [string, string] {
    this.button = eventButton;
    this.svgToCanvas();
    this.getColor(event);
    this.isclicked = true;
    return ['', ''];
  }

  onMouseOut(event: MouseEvent): [string, string] {
    return ['', ''];
  }

  onMouseUp(event: MouseEvent): [string, string] {

    this.isclicked = false;
    return ['', ''];
  }

  onBackspace(event: MouseEvent): [string, string] {
    return ['', ''];
  }
  onEscape(event: MouseEvent): [string, string] {
    return ['', ''];
  }
  onShiftDown(event: MouseEvent): [string, string] {
    return ['', ''];
  }
  onShiftUp(event: MouseEvent): [string, string] {
    return ['', ''];
  }

  onCtrlKey(event: KeyboardEvent): [string, string] {
    return ['', ''];
  }
  getCurrentId(): number {
    return 0;
  }

  setCurrentId(receivedId: number): void {
    return;
  }
}
