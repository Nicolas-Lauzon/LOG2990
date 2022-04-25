import { Injectable } from '@angular/core';
import { ColorService } from '../../color-service/color-service.service';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { Box, INDEX } from '../box';
import { DrawStrategyService } from '../draw-strategy';
import { SHAPE_TYPES } from './../../../enums';
const STROKE_DASH = 25;

enum INTERRUPT {
  PAINTING = 'isPainting',
  SHIFT_DOWN = 'isShiftDown',
  MOUSE_UP = 'mouseUp'
}
enum ATTRIBUTES {
  STROKE_WIDTH = 0,
  TYPE = 1
}

@Injectable({
  providedIn: 'root'
})
export class DrawStrategyEllipseService implements DrawStrategyService {

private currentId: number;

private interruptors: Map<string, boolean>;
actualShape: Box;
selectionBox: Box;

attributes: [number, string];

private colorService: ColorService;
private drawInvoker: DrawInvokerService;

constructor(colorService: ColorService, drawInvoker: DrawInvokerService) {
  this.drawInvoker = drawInvoker;
  this.colorService = colorService;
  this.attributes = [1, ''];
  this.currentId = 0;
  this.interruptors = new Map([[INTERRUPT.PAINTING, false],
                            [INTERRUPT.SHIFT_DOWN, false],
                            [INTERRUPT.MOUSE_UP, false]]);
  this.actualShape =  new Box();
  this.selectionBox = new Box();
}

getCurrentId(): number {
  return this.currentId;
}

setCurrentId(receivedId: number): void {
  this.currentId = receivedId;
}
onSelected(): void {
  return;
}
onMouseMovement(event: MouseEvent): [string, string] {

  if (!this.interruptors.get(INTERRUPT.PAINTING)) {
    return ['', ''];
  }

  this.interruptors.set(INTERRUPT.MOUSE_UP, false);
  this.selectionBox.endPosition[INDEX.X] = event.offsetX;
  this.selectionBox.endPosition[INDEX.Y] = event.offsetY;
  const startX = this.selectionBox.startPosition[INDEX.X];
  const endX = this.selectionBox.endPosition[INDEX.X];
  const startY = this.selectionBox.startPosition[INDEX.Y];
  const endY = this.selectionBox.endPosition[INDEX.Y];
  this.selectionBox.topLeft[INDEX.X] = Math.min(endX, startX);
  this.selectionBox.topLeft[INDEX.Y] =  Math.min(endY, startY);
  this.selectionBox.bottomRight[INDEX.X] = Math.max(endX, startX);
  this.selectionBox.bottomRight[INDEX.Y] = Math.max(endY, startY);
  this.selectionBox.dimensions[INDEX.X] = this.selectionBox.bottomRight[INDEX.X] - this.selectionBox.topLeft[INDEX.X];
  this.selectionBox.dimensions[INDEX.Y] = this.selectionBox.bottomRight[INDEX.Y] - this.selectionBox.topLeft[INDEX.Y];
  this.actualShape = this.selectionBox.clone();
  if (this.interruptors.get(INTERRUPT.SHIFT_DOWN)) {

    const dimension = this.selectionBox.dimensions[INDEX.X] > this.selectionBox.dimensions[INDEX.Y];
    const x = this.selectionBox.endPosition[INDEX.X] > this.selectionBox.startPosition[INDEX.X];
    const y = this.selectionBox.endPosition[INDEX.Y] > this.selectionBox.startPosition[INDEX.Y];

    const width = this.actualShape.dimensions[INDEX.X];
    const height = this.actualShape.dimensions[INDEX.Y];

    this.actualShape.dimensions[INDEX.X] = Math.max(this.selectionBox.dimensions[INDEX.X], this.selectionBox.dimensions[INDEX.Y]);
    this.actualShape.dimensions[INDEX.Y] = Math.max(this.selectionBox.dimensions[INDEX.X], this.selectionBox.dimensions[INDEX.Y]);
    if ((dimension && x && !y) || (dimension && !y && !x) ) {
      this.actualShape.topLeft[INDEX.Y] -= (this.actualShape.dimensions[INDEX.X] - height );
    }
    if ((!dimension && !x && y) || (!dimension && !y && !x)) {
      this.actualShape.topLeft[INDEX.X] -= (this.actualShape.dimensions[INDEX.X] - width );
    }
  }
  return this.tagReturner();
}

onMouseDown(event: MouseEvent): [string, string] {
  this.interruptors.set(INTERRUPT.PAINTING, true);
  this.interruptors.set(INTERRUPT.MOUSE_UP, false);
  this.selectionBox.startPosition[INDEX.X] = event.offsetX;
  this.selectionBox.topLeft[INDEX.X] = event.offsetX;
  this.selectionBox.bottomRight[INDEX.X] = event.offsetX;
  this.selectionBox.startPosition[INDEX.Y] = event.offsetY;
  this.selectionBox.topLeft[INDEX.Y] = event.offsetY;
  this.selectionBox.bottomRight[INDEX.Y] = event.offsetY;
  this.selectionBox.dimensions[INDEX.X] = 0;
  this.selectionBox.dimensions[INDEX.Y] = 0;
  return this.tagReturner();
}
onMouseUp(event: MouseEvent): [string, string] {
  if (!this.interruptors.get(INTERRUPT.PAINTING)) {
    return ['', ''];
  }
  this.interruptors.set(INTERRUPT.SHIFT_DOWN, false);
  this.interruptors.set(INTERRUPT.MOUSE_UP, true);
  this.interruptors.set(INTERRUPT.PAINTING, false);
  const result = this.tagReturner();
  this.currentId++;
  this.actualShape = new Box();
  this.selectionBox = new Box();
  this.drawInvoker.do([[result[0], result[1], '']]);
  return ['', ''];
}
onMouseOut(event: MouseEvent): [string, string] {
  if (!this.interruptors.get(INTERRUPT.PAINTING)) {
    return ['', ''];
  }
  this.interruptors.set(INTERRUPT.SHIFT_DOWN, false);
  return this.onMouseUp(event);
}

  onBackspace(event: MouseEvent): [string, string] {
    if (!this.interruptors.get(INTERRUPT.PAINTING)) {
      return ['', ''];
    }
    return this.tagReturner();
  }
  onEscape(): [string, string] {
    if (!this.interruptors.get(INTERRUPT.PAINTING)) {
      return ['', ''];
    }
    return this.tagReturner();
  }

  onShiftDown(event: MouseEvent): [string, string] {
    if (!this.interruptors.get(INTERRUPT.PAINTING)) {
      return ['', ''];
    }
    this.interruptors.set(INTERRUPT.SHIFT_DOWN, true);
    return this.onMouseMovement(event);
  }
  onShiftUp(event: MouseEvent): [string, string] {
    if (!this.interruptors.get(INTERRUPT.PAINTING)) {
      return ['', ''];
    }
    this.interruptors.set(INTERRUPT.SHIFT_DOWN, false);
    return this.onMouseMovement(event);
  }

  onCtrlKey(event: KeyboardEvent): [string, string] {
    return ['', ''];
  }

  private tagReturner(): [string, string] {

    const shapeWidth: number = this.actualShape.dimensions[INDEX.X];
    const shapeHeight: number = this.actualShape.dimensions[INDEX.Y];
    const fill = this.attributes[ATTRIBUTES.TYPE] === SHAPE_TYPES.CONTOUR ? 'none' : this.colorService.getPrimaryColor();
    const fillClass = this.attributes[ATTRIBUTES.TYPE] === SHAPE_TYPES.CONTOUR ? '' : 'fill';
    const strokeWidth = this.attributes[ATTRIBUTES.TYPE] === SHAPE_TYPES.FILL ? 0 : this.attributes[ATTRIBUTES.STROKE_WIDTH];
    if (this.attributes[ATTRIBUTES.TYPE] === '') {
      this.attributes[ATTRIBUTES.TYPE] = 'contour and fill';
    }

    const result: string = (shapeHeight - 2 * strokeWidth) < 0 || (shapeWidth - 2 * strokeWidth) < 0 ?

      '<ellipse ' +
      ' class="secondary fill' +
      '" cx="' + (this.actualShape.topLeft[INDEX.X] + (shapeWidth / 2)) +
      '" cy="' + (this.actualShape.topLeft[INDEX.Y] + (shapeHeight / 2)) +
      '" rx="' + (shapeWidth / 2) +
      '" ry="' + (shapeHeight / 2) +
      '" stroke-width="0' +
      '" fill="' + this.colorService.getSecondaryColor() + '"/>'
      :
      '<ellipse ' +
      ' class="primary ' + fillClass +
      '" cx="' + (this.actualShape.topLeft[INDEX.X] +  ( shapeWidth / 2)) +
      '" cy="' + (this.actualShape.topLeft[INDEX.Y] +  ( shapeHeight / 2)) +
      '" rx="' + Math.abs((shapeWidth - 2 * strokeWidth) / 2) +
      '" ry="' + Math.abs((shapeHeight - 2 * strokeWidth) / 2) +
      '" stroke="' + this.colorService.getSecondaryColor() +
      '" stroke-width="0' +
      '" fill="' + fill + '"/>' +
      '<ellipse ' +
      ' class="secondary contour' +
      '" cx="' + (this.actualShape.topLeft[INDEX.X]  +  ( shapeWidth / 2)) +
      '" cy="' + (this.actualShape.topLeft[INDEX.Y]  + (shapeHeight / 2)) +
      '" rx="' + Math.abs((shapeWidth - strokeWidth) / 2) +
      '" ry="' + Math.abs((shapeHeight - strokeWidth) / 2) +
      '" stroke="' + this.colorService.getSecondaryColor() +
      '" stroke-width="' + strokeWidth +
      '" fill="none"/>';

    if (this.interruptors.get(INTERRUPT.MOUSE_UP)) {
      const tempHeight = shapeHeight;
      const tempWidth = shapeWidth;
      return ['ellip' + this.currentId,
      '<g id="ellip' + this.currentId + '" class="' + this.attributes[ATTRIBUTES.TYPE] +
      '" x="' + this.actualShape.topLeft[INDEX.X] + '" y="' + this.actualShape.topLeft[INDEX.Y] +
      '" width="' + tempWidth + '" height="' + tempHeight + '">' +
       result + '</g>'];
    }
    return ['ellip' + this.currentId,
    '<g id="ellip' + this.currentId +
    '" x="' + this.actualShape.topLeft[INDEX.X] +

    '" y="' + this.actualShape.topLeft[INDEX.Y] +
    '" width="' + shapeWidth + '" height="' + shapeHeight + '">' +
    '<rect ' +
    ' x="' + (this.actualShape.topLeft[INDEX.X]) +
    '" y="' + (this.actualShape.topLeft[INDEX.Y]) +
    '" width="' + shapeWidth +
    '" height="' + shapeHeight +
    '" fill="none"' +
    '" stroke="black"' +
    ' stroke-dasharray="' + STROKE_DASH + '"/>' + result + '</g>'
    ];
  }

}
