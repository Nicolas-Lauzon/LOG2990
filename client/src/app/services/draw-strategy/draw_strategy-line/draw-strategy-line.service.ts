import { Injectable } from '@angular/core';
import { ColorService } from '../../color-service/color-service.service';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawStrategyService } from '../draw-strategy';

const DELAY_DOUBLE_CLICK = 200;
const MIN_DISTANCE_LAST_POINT = 4;
const INITIAL_SIZE = 5;
const EIGTH_CIRCLE = 0.392699081;
const THREE_EIGTH_CIRCLE = 1.178097245;
const FIVE_EIGTH_CIRCLE = 1.963495408;

export enum DIMENSIONS {
  JOINT_RADIUS = 0,
  LINE_WIDTH = 1
}

export enum IS_USED {
  LINE = 0,
  SHIFT = 1,
  JOINT = 2,
  PREVENT_SINGLE_MOUSE = 3,
}

@Injectable({
  providedIn: 'root',
})
export class DrawStrategyLineService implements DrawStrategyService {
  private currentId: number;
  isUsed: boolean [];
  dimensions: number[];
  points: [number, number][] = [];
  private timerDoubleClick: number;
  private colorService: ColorService;
  private drawInvoker: DrawInvokerService;

  getCurrentId(): number {
    return this.currentId;
  }
  onSelected(): void {
    return;
  }
  setCurrentId(receivedId: number): void {
    this.currentId = receivedId;
  }

  constructor(colorService: ColorService, drawInvoker: DrawInvokerService) {
    this.isUsed = [false, false, false, false];
    this.currentId = 0;
    this.drawInvoker = drawInvoker;
    this.colorService = colorService;
    this.isUsed[IS_USED.JOINT] = true;
    this.dimensions = [INITIAL_SIZE, INITIAL_SIZE];
  }

  onMouseDown(event: MouseEvent): [string, string] {
    if (this.isUsed[IS_USED.PREVENT_SINGLE_MOUSE]) {
      return this.applyMouseDoubleClick(event);
    }

    let result: [string, string] = ['', ''];
    this.isUsed[IS_USED.PREVENT_SINGLE_MOUSE] = true;

    if (this.isUsed[IS_USED.SHIFT] && this.points.length !== 0) {
      this.points.push(this.clipTo45degree([event.offsetX, event.offsetY]));
    } else {
      this.points.push([event.offsetX, event.offsetY]);
    }

    this.timerDoubleClick = window.setTimeout(() => {
      if (this.isUsed[IS_USED.PREVENT_SINGLE_MOUSE]) {
        result = this.applyMouseDown(event);
      }
      this.isUsed[IS_USED.PREVENT_SINGLE_MOUSE] = false;
      }, DELAY_DOUBLE_CLICK);

    return result;
  }

  onMouseMovement(event: MouseEvent): [string, string] {
    if (!this.isUsed[IS_USED.LINE]) {
      return ['', ''];
    }

    let coords: [number, number] = [event.offsetX, event.offsetY];
    if (this.isUsed[IS_USED.SHIFT]) {
      coords = this.clipTo45degree(coords);
    }
    this.points.push(coords);
    const result: [string, string] = this.assembleResult();
    this.points.pop();

    return result;
  }

  onBackspace(event: MouseEvent): [string, string] {
    if (!this.isUsed[IS_USED.LINE]) {
      return ['', ''];
    }

    if (this.points.length > 1) {
      this.points.pop();
    }
    return this.onMouseMovement(event);
  }

  onEscape(event: MouseEvent): [string, string] {
    if (!this.isUsed[IS_USED.LINE]) {
      return ['', ''];
    }
    this.points = [];
    this.isUsed[IS_USED.LINE] = false;
    return this.assembleResult();
  }

  onShiftDown(event: MouseEvent): [string, string] {
    if (!this.isUsed[IS_USED.LINE]) {
      return ['', ''];
    }
    this.isUsed[IS_USED.SHIFT] = true;
    return this.onMouseMovement(event);
  }

  onShiftUp(event: MouseEvent): [string, string] {
    this.isUsed[IS_USED.SHIFT] = false;
    if (!this.isUsed[IS_USED.LINE]) {
      return ['', ''];
    }
    return this.onMouseMovement(event);
  }

  onMouseUp(event: MouseEvent): [string, string] {
    if (!this.isUsed[IS_USED.LINE]) {
      return ['', ''];
    }
    return this.onMouseMovement(event);
  }

  onMouseOut(event: MouseEvent): [string, string] {
    if (!this.isUsed[IS_USED.LINE]) {
      return ['', ''];
    }
    return this.onMouseUp(event);

  }

  private applyMouseDown(event: MouseEvent): [string, string] {
    this.isUsed[IS_USED.LINE] = true;

    return this.assembleResult();
  }

  private applyMouseDoubleClick(event: MouseEvent): [string, string] {
    clearTimeout(this.timerDoubleClick);
    this.isUsed[IS_USED.PREVENT_SINGLE_MOUSE] = false;
    let result: [string, string];
    if (this.calculateDistance(this.points[this.points.length - 1], this.points[0]) < MIN_DISTANCE_LAST_POINT) {
      this.points.push(this.points[0]);
      result = this.assembleResult();
    } else {
      result = this.applyMouseDown(event);
    }

    this.isUsed[IS_USED.LINE] = false;
    this.currentId++;
    this.points = [];
    this.drawInvoker.do([[result[0], result[1], '']]);
    return ['', ''];
  }

  private calculateDistance(coordsFrom: [number, number], coordsTo: [number, number]): number {
    if (coordsTo !== undefined) {
      const deltaCoordsX: number = coordsTo[0] - coordsFrom[0];
      const deltaCoordsY: number = coordsTo[1] - coordsFrom[1];
      const result: number = deltaCoordsX * deltaCoordsX + deltaCoordsY + deltaCoordsY;
      return Math.sqrt(result);
    }
    return 0;
  }

  private assembleResult(): [string, string] {

    let pointString = '';
    let maxX = 0;
    let minX = 0;
    let maxY = 0;
    let minY = 0;
    if (this.points[0] !== undefined) {
      const dotRadius = this.isUsed[IS_USED.JOINT] ? this.dimensions[DIMENSIONS.JOINT_RADIUS] : 0;
      maxX = this.points[0][0] + dotRadius;
      minX = this.points[0][0] - dotRadius;
      maxY = this.points[0][1] + dotRadius;
      minY = this.points[0][1] - dotRadius;
      for (let i = 0; i < this.points.length; i++) {
        pointString += ' ' + this.points[i][0] + ', ' + this.points[i][1];
        maxX < this.points[i][0] + dotRadius ? maxX = this.points[i][0] + dotRadius : maxX = maxX;
        minX > this.points[i][0] - dotRadius ? minX = this.points[i][0] - dotRadius : minX = minX;
        maxY < this.points[i][1] + dotRadius ? maxY = this.points[i][1] + dotRadius : maxY = maxY;
        minY > this.points[i][1] - dotRadius ? minY = this.points[i][1] - dotRadius : minY = minY;

        if (i !== (this.points.length - 1)) {
          pointString += ',';
        }
      }
    }

    let result: string =
    '<g id="line' + this.currentId + '" x="' + minX + '" y="' + minY +
    '" class="other"' +
    ' width="' + (maxX - minX) +
    '" height="' +  (maxY - minY) + '">' +
    '<polyline points="' +
      pointString +
      '" class="primary contour"' +
      ' stroke="' +
      this.colorService.getPrimaryColor() +
      '" stroke-width="' +
      this.dimensions[DIMENSIONS.LINE_WIDTH] +
      '" fill="none"/>';
    if (this.isUsed[IS_USED.JOINT] && this.points[0] !== undefined) {
      for (const point of this.points) {
        result += '<circle cx="' + point[0];
        result += '" class="secondary fill"';
        result += ' cy="' + point[1];
        result += '" r="' + this.dimensions[DIMENSIONS.JOINT_RADIUS];
        result += '" fill="' + this.colorService.getSecondaryColor() + '"/>';
      }
    }

    return ['line' + this.currentId, result];
  }

  private clipTo45degree(coords: [number, number]): [number, number] {
    const result: [number, number] = [0, 0];
    const pastCoords: [number, number] = this.points[this.points.length - 1];
    const deltaCoords: [number, number] = [coords[0] - pastCoords[0], coords[1] - pastCoords[1]];
    const angle: number = Math.atan(deltaCoords[1] / deltaCoords[0]);
    const to0Degree = angle <= EIGTH_CIRCLE && angle > -EIGTH_CIRCLE;
    const to45Degree = angle <= THREE_EIGTH_CIRCLE && angle >= EIGTH_CIRCLE;
    const to90Degree = angle <= FIVE_EIGTH_CIRCLE && angle >= THREE_EIGTH_CIRCLE;
    const toMinus45Degree = angle <= -EIGTH_CIRCLE && angle >= -THREE_EIGTH_CIRCLE;
    const toMinus90Degree = angle <= -THREE_EIGTH_CIRCLE && angle >= -FIVE_EIGTH_CIRCLE;

    if (to0Degree) {
      result[1] = pastCoords[1];
      result[0] = coords[0];
    } else if (to45Degree) {
      result[0] = coords[0];
      result[1] = pastCoords[1] + deltaCoords[0];
    } else if (to90Degree) {
      result[0] = pastCoords[0];
      result[1] = coords[1];
    } else if (toMinus45Degree) {
      result[0] = coords[0];
      result[1] = pastCoords[1] - deltaCoords[0];
    } else if (toMinus90Degree) {
      result[0] = pastCoords[0];
      result[1] = coords[1];
    }

    return result;

  }

  onCtrlKey(event: KeyboardEvent): [string, string] {
    return ['', ''];
  }
}
