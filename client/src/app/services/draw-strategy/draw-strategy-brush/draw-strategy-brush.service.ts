import { Injectable } from '@angular/core';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { Box, INDEX } from '../box';
import { DrawStrategyService } from '../draw-strategy';
import { ColorService } from './../../color-service/color-service.service';

export enum USER_OPTION {
  WIDTH = 0,
  FILTER = 1
}

@Injectable({
  providedIn: 'root',
})
export class DrawStrategyBrushService implements DrawStrategyService {
  private colorService: ColorService;
  private currentId: number;
  private isPainting: boolean;
  points: string;
  userOptions: [number, string];
  private outterBox: Box;
  private drawInvoker: DrawInvokerService;

  getCurrentId(): number {
    return this.currentId;
  }

  setCurrentId(receivedId: number): void {
    this.currentId = receivedId;
  }

  constructor(colorService: ColorService, drawInvoker: DrawInvokerService) {
    this.outterBox = new Box();
    this.drawInvoker = drawInvoker;
    this.colorService = colorService;
    this.userOptions = [1, 'filter0'];
    this.points = '';
    this.isPainting = false;
    this.currentId = 0;
  }

  onMouseMovement(event: MouseEvent): [string, string] {

    if (!this.isPainting) {
      return ['', ''];
    }

    this.points += '' + event.offsetX + ',' + event.offsetY + ' ';
    this.outterBox.bottomRight[INDEX.X] < event.offsetX ?
      this.outterBox.bottomRight[INDEX.X] = event.offsetX :
      this.outterBox.bottomRight[INDEX.X] = this.outterBox.bottomRight[INDEX.X];

    this.outterBox.topLeft[INDEX.X] > event.offsetX ?
     this.outterBox.topLeft[INDEX.X] = event.offsetX :
     this.outterBox.topLeft[INDEX.X] = this.outterBox.topLeft[INDEX.X];

    this.outterBox.bottomRight[INDEX.Y] < event.offsetY ?
      this.outterBox.bottomRight[INDEX.Y] = event.offsetY :
      this.outterBox.bottomRight[INDEX.Y] = this.outterBox.bottomRight[INDEX.Y];

    this.outterBox.topLeft[INDEX.Y] > event.offsetY ?
      this.outterBox.topLeft[INDEX.Y] = event.offsetY :
      this.outterBox.topLeft[INDEX.Y] = this.outterBox.topLeft[INDEX.Y];

    return this.assembleResult();
  }

  onMouseDown(event: MouseEvent): [string, string] {

    this.isPainting = true;
    this.outterBox.bottomRight[INDEX.X] = event.offsetX;
    this.outterBox.topLeft[INDEX.X] = event.offsetX;
    this.outterBox.bottomRight[INDEX.Y] = event.offsetY;
    this.outterBox.topLeft[INDEX.Y] = event.offsetY;
    this.points += '' + event.offsetX + ',' + event.offsetY + ' ';
    this.points += '' + (event.offsetX + 1) + ',' + (event.offsetY + 1) + ' ';

    return this.assembleResult();
  }

  onMouseUp(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }

    this.isPainting = false;
    const result: [string, string] = this.assembleResult();
    this.currentId++;
    this.points = '';
    this.outterBox.bottomRight[INDEX.X] = 0;
    this.outterBox.topLeft[INDEX.X] = 0;
    this.outterBox.bottomRight[INDEX.Y] = 0;
    this.outterBox.topLeft[INDEX.Y] = 0;
    this.drawInvoker.do([[result[0], result[1], '']]);
    return ['', ''];
  }

  onMouseOut(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    return this.onMouseUp(event);
  }

  onBackspace(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    return this.assembleResult();
  }
  onEscape(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    return this.assembleResult();
  }
  onSelected(): void {
    return;
  }
  onShiftDown(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    return this.assembleResult();
  }
  onShiftUp(event: MouseEvent): [string, string] {
    if (!this.isPainting) {
      return ['', ''];
    }
    return this.assembleResult();
  }

  private assembleResult(): [string, string] {
    return [
      'brush' + this.currentId,
      '<g id="brush' + this.currentId +
      '" class="contour"' +
      ' x="' + (this.outterBox.topLeft[INDEX.X] - this.userOptions[USER_OPTION.WIDTH] / 2) +
      '" y="' + (this.outterBox.topLeft[INDEX.Y] - this.userOptions[USER_OPTION.WIDTH] / 2) +
      '" width="' + (this.outterBox.bottomRight[INDEX.X] - this.outterBox.topLeft[INDEX.X] + this.userOptions[USER_OPTION.WIDTH]) +
      '" height="' +  (this.outterBox.bottomRight[INDEX.Y] - this.outterBox.topLeft[INDEX.Y] + this.userOptions[USER_OPTION.WIDTH]) +
      '" filter="url(#' +
      this.userOptions[USER_OPTION.FILTER] +
      ')"><polyline class="primary contour"' +
      'stroke="' + this.colorService.getPrimaryColor() +
      '" fill="none" stroke-width="' + this.userOptions[USER_OPTION.WIDTH] +
      '" points="' +
      this.points +
      '" style="shape-rendering:geometricPrecision;' +
      'stroke-linecap:round;stroke-linejoin:round" /></g>',
    ];
  }

  onCtrlKey(event: KeyboardEvent): [string, string] {
    return ['', ''];
  }

}
