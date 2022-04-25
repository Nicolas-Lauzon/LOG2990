import { Injectable } from '@angular/core';
import { ColorService } from '../../color-service/color-service.service';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawStrategyService } from '../draw-strategy';

@Injectable({
  providedIn: 'root',
})
export class DrawStrategyPencilService implements DrawStrategyService {
  currentId: number;
  private isPainting: boolean;
  width: number;
  points: string;
  maxX: number;
  minX: number;
  maxY: number;
  minY: number;
  private colorService: ColorService;
  private drawInvoker: DrawInvokerService;

  constructor(colorService: ColorService, drawInvoker: DrawInvokerService) {
    this.drawInvoker = drawInvoker;
    this.width = 1;
    this.colorService = colorService;
    this.points = '';
    this.currentId = 0;

    this.maxX = 0;
    this.minX = 0;
    this.maxY = 0;
    this.minY = 0;
  }
  onMouseMovement(event: MouseEvent): [string, string] {

    if (!this.isPainting) {
      return ['', ''];
    }

    this.points += '' + event.offsetX + ',' + event.offsetY + ' ';
    this.maxX < event.offsetX ? this.maxX = event.offsetX : this.maxX = this.maxX;
    this.minX > event.offsetX ? this.minX = event.offsetX : this.minX = this.minX;
    this.maxY < event.offsetY ? this.maxY = event.offsetY : this.maxY = this.maxY;
    this.minY > event.offsetY ? this.minY = event.offsetY : this.minY = this.minY;

    return this.tagReturner();
  }

  onMouseDown(event: MouseEvent): [string, string] {
    this.isPainting = true;
    this.maxX = event.offsetX;
    this.minX = event.offsetX;
    this.maxY = event.offsetY;
    this.minY = event.offsetY;

    this.points += '' + event.offsetX + ',' + event.offsetY + ' ';
    this.points += '' + (event.offsetX + 1) + ',' + (event.offsetY + 1) + ' ';
    return this.tagReturner();
  }
  onMouseOut(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    return this.onMouseUp(event);
  }

  onMouseUp(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    this.isPainting = false;
    const result: [string, string] = this.tagReturner();
    this.points = '';
    this.currentId++;

    this.maxX = 0;
    this.minX = 0;
    this.maxY = 0;
    this.minY = 0;
    this.drawInvoker.do([[result[0], result[1], '']]);

    return ['', ''];
  }
  onSelected(): void {
    return;
  }
  onBackspace(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    return this.tagReturner();
  }
  onEscape(): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    return this.tagReturner();
  }

  onShiftDown(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    return this.tagReturner();
  }
  onShiftUp(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    return this.tagReturner();
  }

  private tagReturner(): [string, string] {

    return [
      'pencil' + this.currentId,
      '<g id="pencil' + this.currentId +
      '" class="contour' + '" x="' + (this.minX - this.width / 2) + '" y="' + (this.minY - this.width / 2) +
      '" width="' + (this.maxX - this.minX + this.width) +
      '" height="' +  (this.maxY - this.minY + this.width) + '">' +
      '<polyline ' +
      'class="primary contour"' +
      'stroke="' + this.colorService.getPrimaryColor() +
      '" fill="none" stroke-width="' + this.width +
      '" points="' +
      this.points +
      '" style="fill:none;shape-rendering:geometricPrecision;' +
      'stroke-width:' +
      this.width +
      ';stroke-linecap:round;stroke-linejoin:round" /></g>',
    ];
  }

  onCtrlKey(event: KeyboardEvent): [string, string] {
    return ['', ''];
  }

  getCurrentId(): number {
    return this.currentId;
  }

  setCurrentId(receivedId: number): void {
    this.currentId = receivedId;
  }
}
