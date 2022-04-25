import { Injectable } from '@angular/core';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawStrategyService } from '../draw-strategy';
import { ColorService } from './../../color-service/color-service.service';

const FACTER_POINTS_PAR_SPRAY = 16;
const DEFAULT_INTERVAL = 100;
const INITIAL_STROKE = 24;
const RADIUS_POINTS = 0.5;

enum INDEX {
  MAX_X = 0,
  MAX_Y = 1,
  MIN_X = 2,
  MIN_Y = 3
}
enum ATTRIBUTE {
  STROKE_WIDTH = 0,
  SPRAYS = 1,
}
@Injectable({
  providedIn: 'root'
})
export class DrawStrategySprayService implements DrawStrategyService {

  atributes: [number, number];

  points: string;
  private currentId: number;
  private isPainting: boolean;
  private colorService: ColorService;

  coords: [number, number, number, number];
  drawInvoker: DrawInvokerService;

constructor(colorService: ColorService, drawInvoker: DrawInvokerService) {
  this.drawInvoker = drawInvoker;
  this.colorService = colorService;
  this.atributes = [INITIAL_STROKE, DEFAULT_INTERVAL];
  this.points = '';
  this.isPainting = false;
  this.currentId = 0;
  this.coords = [0, 0, 0, 0];
 }
 getCurrentId(): number {
  return this.currentId;
}
onSelected(): void {
  return;
}
setCurrentId(receivedId: number): void {
  this.currentId = receivedId;
}

onMouseMovement(event: MouseEvent): [string, string] {
  return ['', ''];
}
onMouseDown(event: MouseEvent): [string, string] {
  this.isPainting = true;
  const coord: [number, number] = [event.offsetX , event.offsetY];

  if (this.points === '') {
    this.coords[INDEX.MAX_X] = event.offsetX + this.atributes[ATTRIBUTE.STROKE_WIDTH];
    this.coords[INDEX.MAX_Y] = event.offsetY + this.atributes[ATTRIBUTE.STROKE_WIDTH];
    this.coords[INDEX.MIN_X] = event.offsetX - this.atributes[ATTRIBUTE.STROKE_WIDTH];
    this.coords[INDEX.MIN_Y] = event.offsetY - this.atributes[ATTRIBUTE.STROKE_WIDTH];
  } else {
    this.coords[INDEX.MAX_X] = Math.max(this.coords[INDEX.MAX_X], event.offsetX + this.atributes[ATTRIBUTE.STROKE_WIDTH]);
    this.coords[INDEX.MIN_X] = Math.min(this.coords[INDEX.MIN_X], event.offsetX - this.atributes[ATTRIBUTE.STROKE_WIDTH]);
    this.coords[INDEX.MAX_Y] = Math.max(this.coords[INDEX.MAX_Y], event.offsetY + this.atributes[ATTRIBUTE.STROKE_WIDTH]);
    this.coords[INDEX.MIN_Y] = Math.min(this.coords[INDEX.MIN_Y], event.offsetY - this.atributes[ATTRIBUTE.STROKE_WIDTH]);
  }
  this.addPoints(coord);
  return this.tagReturner();
}
onMouseUp(event: MouseEvent): [string, string] {
  if (!this.isPainting) {
    return ['', ''];
  }

  this.isPainting = false;
  const result = this.tagReturner();
  this.points = '';
  this.currentId++;

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
  return this.tagReturner();
}
onEscape(event: MouseEvent): [string, string] {
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
onCtrlKey(event: KeyboardEvent): [string, string] {
  return ['', ''];
}

private getRandom(max: number, min: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

private isInRadius(coord: [number, number], x: number, y: number): boolean {

  if ( Math.pow((x - coord[0]), 2) + Math.pow((y - coord[1] ), 2) <= Math.pow(this.atributes[ATTRIBUTE.STROKE_WIDTH], 2) ) {
    return true;
  }
  return false;
}

private addPoints(coord: [number, number]): void {

  for (let i = 0; i < this.atributes[ATTRIBUTE.STROKE_WIDTH] / FACTER_POINTS_PAR_SPRAY ; i++ ) {
    const x = this.getRandom(coord[0] + this.atributes[ATTRIBUTE.STROKE_WIDTH], coord[0] - this.atributes[ATTRIBUTE.STROKE_WIDTH] );
    const y = this.getRandom(coord[1] + this.atributes[ATTRIBUTE.STROKE_WIDTH], coord[1] - this.atributes[ATTRIBUTE.STROKE_WIDTH]);
    if (this.isInRadius(coord, x , y)) {

      this.points +=  '<circle class="primary fill contour" cx="' + x +
      '" cy="' + y +
      '" r="' + RADIUS_POINTS +
      '" fill="' + this.colorService.getPrimaryColor() +
      '" stroke="' + this.colorService.getPrimaryColor() +
      '" strok-width="1"' +
      ' />';
    }
   }

}
private tagReturner(): [string, string] {
  const res: [string, string] = ['spray' + (this.currentId),
  '<g id="spray' + (this.currentId ) + '" class="contour' + '" x="' + (this.coords[INDEX.MIN_X]) + '" y="' + (this.coords[INDEX.MIN_Y]) +
  '" width="' + (this.coords[INDEX.MAX_X] - this.coords[INDEX.MIN_X]) +
  '" height="' +  (this.coords[INDEX.MAX_Y] - this.coords[INDEX.MIN_Y]) + '">' +
  this.points + '</g>'];
  return res;
}

}
