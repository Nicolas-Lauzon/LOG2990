import { Injectable} from '@angular/core';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawStrategyService } from '../draw-strategy';
import { SHAPE_TYPES } from './../../../enums';
import { ColorService } from './../../color-service/color-service.service';
import { arrayPos, PolygonParameters } from './polygon-parameters';

const ANGLE_POUR_X_NEG = 90;
const ANGLE_POUR_Y_NEG = 270;
const ANGLE_POUR_X_ET_Y_NEG = 180;
const STROKE_DASH = 25;
const PI = 3.14159265359;
const BILLION = 1000000000;
const FULL_CIRCLE = 360;
const MINUS_ONE = -1;
const ROTATION = 4.712388980385;
const THREE = 3;
@Injectable({
  providedIn: 'root'
})
export class DrawStrategyPolygonService implements DrawStrategyService {

  currentId: number;
  mouseStatus: boolean[];
  transform: number;
  private colorService: ColorService;
  private drawInvoker: DrawInvokerService;
  polygonParams: PolygonParameters;
  type: string;

  constructor(colorService: ColorService, drawInvoker: DrawInvokerService) {
    this.drawInvoker = drawInvoker;
    this.colorService = colorService;
    this.transform = 0;
    this.currentId = 0;
    this.polygonParams = new PolygonParameters();
    this.mouseStatus = [false, false];
    this.type = '';
  }
  onSelected(): void {
    return;
  }
  onMouseMovement(event: MouseEvent): [string, string] {
    if (!this.mouseStatus[0]) {
      return ['', ''];
    }
    const x1: number = event.offsetX;
    const y1: number = event.offsetY;
    this.mouseStatus[1] = false;
    this.polygonParams.inverseColors = false;
    this.polygonParams.limitCoords[arrayPos.MAX_X] = 0;
    this.polygonParams.limitCoords[arrayPos.MAX_Y] = 0;
    this.polygonParams.limitCoords[arrayPos.MIN_X] = 0;
    this.polygonParams.limitCoords[arrayPos.MIN_Y] = 0;
    this.selectRotation( x1, y1 );
    const shortestSide = (this.polygonParams.rectangleDimensions[arrayPos.WIDTH] >
      this.polygonParams.rectangleDimensions[arrayPos.HEIGHT]) ?
    this.polygonParams.rectangleDimensions[arrayPos.HEIGHT] : this.polygonParams.rectangleDimensions[arrayPos.WIDTH];
    this.polygonParams.radius[arrayPos.INNER_RAD] = shortestSide / 2;
    const shortSide = (this.polygonParams.rectangleDimensions[arrayPos.WIDTH] >
      this.polygonParams.rectangleDimensions[arrayPos.HEIGHT]) ?  'y' : 'x';
    const centerX = (this.polygonParams.positions[arrayPos.START_POSITION_X] + x1) / 2;
    let centerY = (this.polygonParams.positions[arrayPos.START_POSITION_Y] + y1) / 2;
    const xDistance = this.polygonParams.rectangleDimensions[arrayPos.WIDTH] / 2;
    const yDistance = this.polygonParams.rectangleDimensions[arrayPos.HEIGHT] / 2;

    if (shortSide === 'y') {
      if (this.polygonParams.attributes[arrayPos.NB_SIDES] % 2 !== 0) {
        this.polygonParams.radius[arrayPos.INNER_RAD] = shortestSide / (1 + this.getStrokeWidthHypotenuse());
        this.polygonParams.radius[arrayPos.INNER_RAD] =
        this.checkXLimits(this.polygonParams.radius[arrayPos.INNER_RAD], xDistance, centerX, 'x');
        centerY = (y1 > this.polygonParams.positions[arrayPos.START_POSITION_Y]) ?
        this.polygonParams.positions[arrayPos.START_POSITION_Y] + this.polygonParams.radius[arrayPos.INNER_RAD]
        : y1 + this.polygonParams.radius[arrayPos.INNER_RAD];
      }
    } else {
      this.polygonParams.radius[arrayPos.INNER_RAD] = this.polygonParams.rectangleDimensions[arrayPos.WIDTH] * THREE;
      this.polygonParams.radius[arrayPos.INNER_RAD] =
      this.checkXLimits(this.polygonParams.radius[arrayPos.INNER_RAD] , xDistance, centerX, 'x');
      if (this.polygonParams.attributes[arrayPos.NB_SIDES] % 2 === 0) {
        this.polygonParams.radius[arrayPos.INNER_RAD] =
        this.checkXLimits(this.polygonParams.radius[arrayPos.INNER_RAD] , yDistance, centerY, 'y');
      }
      centerY = (y1 > this.polygonParams.positions[arrayPos.START_POSITION_Y]) ?
      this.polygonParams.positions[arrayPos.START_POSITION_Y] + this.polygonParams.radius[arrayPos.INNER_RAD] :
       y1 + this.polygonParams.radius[arrayPos.INNER_RAD];
    }
    const tempOuterRadius = this.polygonParams.radius[arrayPos.INNER_RAD];
    this.polygonParams.radius[arrayPos.INNER_RAD] = this.polygonParams.radius[arrayPos.INNER_RAD] -
     ((this.polygonParams.attributes[arrayPos.STROKE_WIDTH] /
    (this.getStrokeWidthHypotenuse())) / 2);
    this.adaptToType(tempOuterRadius);
    this.polygonParams.radius[arrayPos.OUTER_RAD] = (this.polygonParams.radius[arrayPos.OUTER_RAD] <= 0) ?
    0 : this.polygonParams.radius[arrayPos.OUTER_RAD] ;
    if (this.type === '' || 'contour') {
        this.polygonParams.points[arrayPos.OUTER_POINTS] = (this.polygonParams.radius[arrayPos.INNER_RAD] === 0) ?
        '' : this.getPolygonCoordinates(centerX, centerY, this.polygonParams.radius[arrayPos.INNER_RAD]);
    }
    this.polygonParams.points[arrayPos.INNER_POINTS] = (this.polygonParams.radius[arrayPos.OUTER_RAD] === 0) ?
    '' : this.getPolygonCoordinates(centerX, centerY, this.polygonParams.radius[arrayPos.OUTER_RAD] + 1);
    return this.tagReturner();
  }

  private selectRotation(x1: number, y1: number): void {
    this.polygonParams.points[arrayPos.OUTER_POINTS] = '';
    this.polygonParams.points[arrayPos.INNER_POINTS] = '';
    this.transform = 0;
    this.polygonParams.rectangleDimensions[arrayPos.WIDTH] =
    (x1 > this.polygonParams.positions[arrayPos.START_POSITION_X]) ?
    x1 - this.polygonParams.positions[arrayPos.START_POSITION_X]
    : this.polygonParams.positions[arrayPos.START_POSITION_X] - x1;

    this.polygonParams.rectangleDimensions[arrayPos.HEIGHT] =
    (y1 > this.polygonParams.positions[arrayPos.START_POSITION_Y]) ?
    y1 - this.polygonParams.positions[arrayPos.START_POSITION_Y]
    : this.polygonParams.positions[arrayPos.START_POSITION_Y] - y1;

    this.polygonParams.rectangleDimensions[arrayPos.RECT_WIDTH] =
    this.polygonParams.rectangleDimensions[arrayPos.WIDTH];
    this.polygonParams.rectangleDimensions[arrayPos.RECT_HEIGHT] =
    this.polygonParams.rectangleDimensions[arrayPos.HEIGHT];
    if (x1 < this.polygonParams.positions[arrayPos.START_POSITION_X]) {
      const tmpWidth: number = this.polygonParams.rectangleDimensions[arrayPos.RECT_WIDTH];
      this.transform = ANGLE_POUR_X_NEG;
      this.polygonParams.rectangleDimensions[arrayPos.RECT_WIDTH] =
      this.polygonParams.rectangleDimensions[arrayPos.RECT_HEIGHT];
      this.polygonParams.rectangleDimensions[arrayPos.RECT_HEIGHT] = tmpWidth;
    }
    if (y1 < this.polygonParams.positions[arrayPos.START_POSITION_Y]) {
      const tmpWidth: number = this.polygonParams.rectangleDimensions[arrayPos.RECT_WIDTH];
      this.transform = ANGLE_POUR_Y_NEG;
      this.polygonParams.rectangleDimensions[arrayPos.RECT_WIDTH] =
      this.polygonParams.rectangleDimensions[arrayPos.RECT_HEIGHT];
      this.polygonParams.rectangleDimensions[arrayPos.RECT_HEIGHT] = tmpWidth;
    }
    if (y1 < this.polygonParams.positions[arrayPos.START_POSITION_Y]
      && x1 < this.polygonParams.positions[arrayPos.START_POSITION_X]) {
      this.transform = ANGLE_POUR_X_ET_Y_NEG;
    }
  }

  private adaptToType(tempOuterRadius: number): void {
    if (this.polygonParams.radius[arrayPos.INNER_RAD] <= 0 || this.type === SHAPE_TYPES.FILL) {
      this.polygonParams.radius[arrayPos.OUTER_RAD] = tempOuterRadius;
      this.polygonParams.radius[arrayPos.INNER_RAD] = 0;
      this.polygonParams.inverseColors = (this.type === SHAPE_TYPES.FILL) ? false : true;
    } else {this.polygonParams.radius[arrayPos.OUTER_RAD] = this.polygonParams.radius[arrayPos.INNER_RAD] -
            ((this.polygonParams.attributes[arrayPos.STROKE_WIDTH] / (this.getStrokeWidthHypotenuse())) / 2);
            this.polygonParams.radius[arrayPos.OUTER_RAD] = (this.type === SHAPE_TYPES.CONTOUR) ?
            0 : this.polygonParams.radius[arrayPos.OUTER_RAD]; }
  }

  private getXAngle(angle: number): number {
    return (Math.cos(angle * (PI / ANGLE_POUR_X_ET_Y_NEG) + (ROTATION)));
  }

  private getYAngle(angle: number): number {
    return (Math.sin(angle * (PI / ANGLE_POUR_X_ET_Y_NEG) + (ROTATION)));
  }

  private getStrokeWidthHypotenuse(): number {
    return Math.sin( ( ( ( (this.polygonParams.attributes[arrayPos.NB_SIDES] - 2) * ANGLE_POUR_X_ET_Y_NEG) /
    this.polygonParams.attributes[arrayPos.NB_SIDES]) / 2)
     * (PI / ANGLE_POUR_X_ET_Y_NEG));
  }

  private getPolygonCoordinates(centerX: number , centerY: number, radius: number): string {
    let outerPoints = '';
    for (let i = 0 ; i < this.polygonParams.attributes[arrayPos.NB_SIDES] ; i++) {
      const angle = (FULL_CIRCLE / this.polygonParams.attributes[arrayPos.NB_SIDES]) * i;
      const coordX = radius * this.getXAngle(angle) + centerX;
      const coordY = radius * this.getYAngle(angle) + centerY;
      outerPoints += ' ' + coordX + ',' + coordY;
      this.memoriseMinMax(coordX, coordY);

    }
    return outerPoints;
  }

  private memoriseMinMax(coordX: number, coordY: number): void {
    let strokeWidth = this.polygonParams.attributes[arrayPos.STROKE_WIDTH];
    if (this.type === SHAPE_TYPES.FILL) {
      strokeWidth = 0;
    }

    if (!this.polygonParams.limitCoords[arrayPos.MAX_X] && !this.polygonParams.limitCoords[arrayPos.MAX_Y] &&
      !this.polygonParams.limitCoords[arrayPos.MIN_Y] && !this.polygonParams.limitCoords[arrayPos.MIN_X]) {
      this.polygonParams.limitCoords[arrayPos.MAX_X] = coordX + strokeWidth;
      this.polygonParams.limitCoords[arrayPos.MAX_Y] = coordY + strokeWidth;
      this.polygonParams.limitCoords[arrayPos.MIN_X] = coordX - strokeWidth;
      this.polygonParams.limitCoords[arrayPos.MIN_Y] = coordY - strokeWidth;
    } else {
      this.polygonParams.limitCoords[arrayPos.MAX_X] = Math.max(this.polygonParams.limitCoords[arrayPos.MAX_X], coordX + strokeWidth);
      this.polygonParams.limitCoords[arrayPos.MIN_X] = Math.min(this.polygonParams.limitCoords[arrayPos.MIN_X], coordX - strokeWidth);
      this.polygonParams.limitCoords[arrayPos.MAX_Y] = Math.max(this.polygonParams.limitCoords[arrayPos.MAX_Y], coordY + strokeWidth);
      this.polygonParams.limitCoords[arrayPos.MIN_Y] = Math.min(this.polygonParams.limitCoords[arrayPos.MIN_Y], coordY - strokeWidth);
    }
  }

  private checkXLimits(outerRadius: number , distance: number, center: number, side: string): number {
    for (let i = 0 ; i < this.polygonParams.attributes[arrayPos.NB_SIDES] ; i++) {
      const angle = (FULL_CIRCLE / this.polygonParams.attributes[arrayPos.NB_SIDES]) * i;
      let coordX = (side === 'x') ? (outerRadius * this.getXAngle(angle) + center) : (outerRadius * this.getYAngle(angle) + center);
      coordX = Math.round(coordX * BILLION) / BILLION;
      if (coordX > (center + distance)) {
        const newOuterRadius = (side === 'x') ? (distance / this.getXAngle(angle)) : (distance / this.getYAngle(angle));
        return this.checkXLimits(newOuterRadius, distance, center, side);

      } else if (coordX < (center - distance)) {
        let newOuterRadius = (side === 'x') ? (distance / this.getXAngle(angle)) : (distance / this.getYAngle(angle));
        if (newOuterRadius < 0 ) {
          newOuterRadius = newOuterRadius * MINUS_ONE;
        }
        return this.checkXLimits(newOuterRadius, distance, center, side);
      }
    }
    return outerRadius;
  }

  onMouseDown(event: MouseEvent): [string, string] {
    this.mouseStatus[0] = true;
    this.mouseStatus[1] = false;
    this.polygonParams.positions[arrayPos.START_POSITION_X] = event.offsetX;
    this.polygonParams.positions[arrayPos.START_POSITION_Y] = event.offsetY;
    return this.tagReturner();
  }
  onMouseUp(event: MouseEvent): [string, string] {
    if (!this.mouseStatus[0]) {
      return ['', ''];
    }
    this.mouseStatus[1] = true;
    this.mouseStatus[0] = false;
    const result = this.tagReturner();
    this.polygonParams.limitCoords[arrayPos.MAX_X] = 0;
    this.polygonParams.limitCoords[arrayPos.MAX_Y] = 0;
    this.polygonParams.limitCoords[arrayPos.MIN_X] = 0;
    this.polygonParams.limitCoords[arrayPos.MIN_Y] = 0;
    this.currentId++;
    this.drawInvoker.do([[result[0], result[1], '']]);
    return ['', ''];
  }

  onMouseOut(event: MouseEvent): [string, string] {
    if (!this.mouseStatus[0]) {
      return ['', ''];
    }
    return this.onMouseUp(event);
  }

  onBackspace(event: MouseEvent): [string, string] {
    if (!this.mouseStatus[0]) {
      return ['', ''];
    }
    return this.tagReturner();
  }
  onEscape(): [string, string] {
    if (!this.mouseStatus[0]) {
      return ['', ''];
    }
    return this.tagReturner();
  }

  onShiftDown(event: MouseEvent): [string, string] {
    if (!this.mouseStatus[0]) {
      return ['', ''];
    }
    return this.onMouseMovement(event);
  }
  onShiftUp(event: MouseEvent): [string, string] {
    if (!this.mouseStatus[0]) {
      return ['', ''];
    }
    return this.onMouseMovement(event);
  }

  tagReturner(): [string, string] {

    const strokeWidth = this.type === SHAPE_TYPES.FILL ? 0 : this.polygonParams.attributes[arrayPos.STROKE_WIDTH];
    const outerPoints = this.polygonParams.points[arrayPos.OUTER_POINTS];
    const innerPoints = this.polygonParams.points[arrayPos.INNER_POINTS];

    const outerPolygonColors = this.colorService.getSecondaryColor();
    const innerPolygonColors = (this.polygonParams.inverseColors) ? outerPolygonColors : this.colorService.getPrimaryColor();

    let result = '';
    if (this.type === '') {
      this.type = 'contour and fill';
    }
    if (this.type === 'contour and fill' || 'contour') {
      result += '<polygon ' +
        ' class="secondary contour' +
        '" points=' + '"' + outerPoints +
        '" stroke=' + outerPolygonColors +
        ' stroke-width="' + strokeWidth +
        '" fill="none" />';
    }
    result +=
      '<polygon ' +
      ' class="primary fill"' +
      ' points=' + '"' + innerPoints + '"' +
      ' stroke="none"' +
      ' stroke-width="0" fill="' + innerPolygonColors +
      '"/>';

    if (this.mouseStatus[1]) {
      this.polygonParams.rectangleDimensions[arrayPos.RECT_WIDTH] = 0;
      this.polygonParams.rectangleDimensions[arrayPos.RECT_HEIGHT] = 0;
      this.polygonParams.rectangleDimensions[arrayPos.WIDTH] = 0;
      this.polygonParams.rectangleDimensions[arrayPos.HEIGHT] = 0;
      this.polygonParams.points[arrayPos.OUTER_POINTS] = '';
      this.polygonParams.points[arrayPos.INNER_POINTS] = '';
      return ['polygon' + this.currentId,
      '<g id="polygon' + this.currentId +
      '" class="' + this.type +
      '" x="' + (this.polygonParams.limitCoords[arrayPos.MIN_X]) + '" y="' + (this.polygonParams.limitCoords[arrayPos.MIN_Y]) +
      '" width="' + (this.polygonParams.limitCoords[arrayPos.MAX_X] - this.polygonParams.limitCoords[arrayPos.MIN_X]) +
      '" height="' +  (this.polygonParams.limitCoords[arrayPos.MAX_Y] - this.polygonParams.limitCoords[arrayPos.MIN_Y]) +
       '">' + result + '</svg>'];
    }
    return ['polygon' + this.currentId,
    '<g id="polygon' + this.currentId +
    '"><rect ' +
    '" x="' + (this.polygonParams.positions[arrayPos.START_POSITION_X]) +
    '" y="' + (this.polygonParams.positions[arrayPos.START_POSITION_Y]) +
    '" width="' + this.polygonParams.rectangleDimensions[arrayPos.RECT_WIDTH] +
    '" height="' + this.polygonParams.rectangleDimensions[arrayPos.RECT_HEIGHT] +
    '" fill="none"' +
    '" stroke="black"' +
    ' stroke-dasharray="' + STROKE_DASH +
    '" transform-origin="' + this.polygonParams.positions[arrayPos.START_POSITION_X] + ' ' +
    this.polygonParams.positions[arrayPos.START_POSITION_Y] +
    '" transform="rotate(' + this.transform +
    ')" />' + result + '</g>'
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
