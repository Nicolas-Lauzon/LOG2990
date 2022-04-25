import { DrawingService } from '../../drawing-service/drawing.service';
import { Box, INDEX } from '../box';
import { DRAWING_MENU_WIDTH } from './../../../constants';
import { MOUSE_BUTTON } from './mouse-enum';

const CONTROL_POINT_SIZE = 5;
const STROKE_DASH = 25;
export enum TARGET_INDEX {
  CURRENT = 0,
  TEMPORARY = 1
}

export class Selection {
  private isSelecting: boolean;
  private button: number;
  private selectionBox: Box;
  selectedBox: Box;
  targets: Map<string, Element>[];
  private drawingService: DrawingService;
  menuOffset: number;

  initialSelectedBox: Box;

  constructor(targets: Map<string, Element>, drawingService: DrawingService) {
    this.drawingService = drawingService;
    this.isSelecting = false;
    this.selectionBox = new Box();
    this.initialSelectedBox = new Box();
    this.selectedBox = new Box();
    this.button = 0;
    this.targets = [targets,
                    new Map<string, Element>()];
    this.menuOffset = 0;
   }

   isWithinSelection(event: MouseEvent): boolean {
    this.updateSelectedZone();
    return (event.offsetX + this.menuOffset - DRAWING_MENU_WIDTH) > this.selectedBox.topLeft[INDEX.X] &&
    event.offsetY > this.selectedBox.topLeft[INDEX.Y] &&
    (event.offsetX + this.menuOffset - DRAWING_MENU_WIDTH) < this.selectedBox.bottomRight[INDEX.X] &&
    event.offsetY < this.selectedBox.bottomRight[INDEX.Y];
   }

  private updatePosition(event: MouseEvent): void {
    this.selectionBox.endPosition[INDEX.X] = event.offsetX + this.menuOffset - DRAWING_MENU_WIDTH;
    this.selectionBox.endPosition[INDEX.Y] = event.offsetY;

    const startX = this.selectionBox.startPosition[INDEX.X];
    const endX = this.selectionBox.endPosition[INDEX.X];
    const startY = this.selectionBox.startPosition[INDEX.Y];
    const endY = this.selectionBox.endPosition[INDEX.Y];

    this.selectionBox.topLeft[INDEX.X] = Math.min(endX, startX);
    this.selectionBox.topLeft[INDEX.Y] =  Math.min(endY, startY);
    this.selectionBox.bottomRight[INDEX.X] = Math.max(endX, startX);
    this.selectionBox.bottomRight[INDEX.Y] = Math.max(endY, startY);
  }

  private scan(): void {
    const svg  = this.drawingService.svg as SVGSVGElement;
    const draw  = svg.getElementById('drawZone') as SVGElement;

    const rect = svg.createSVGRect() as SVGRect;
    rect.x = this.selectionBox.topLeft[INDEX.X];
    rect.y = this.selectionBox.topLeft[INDEX.Y];
    rect.width = this.selectionBox.dimensions[INDEX.X];
    rect.height = this.selectionBox.dimensions[INDEX.Y];
    const results = svg.getIntersectionList(rect, draw);
    if (this.button === MOUSE_BUTTON.LEFT) {
      this.targets[TARGET_INDEX.CURRENT].clear();
    } else if (this.button === MOUSE_BUTTON.RIGHT) {
      this.targets[TARGET_INDEX.TEMPORARY] = new Map<string, Element>(this.targets[TARGET_INDEX.CURRENT]);
    }
    this.findWithinScaned(results);
  }

  private findWithinScaned(tagets: NodeList): void {

    const x = this.selectionBox.topLeft[INDEX.X];
    const width = this.selectionBox.dimensions[INDEX.X];
    const y = this.selectionBox.topLeft[INDEX.Y];
    const height = this.selectionBox.dimensions[INDEX.Y];
    tagets.forEach((target) => {
      if (!this.drawingService.drawBoard) {
        return;
      }
      const parent = target.parentElement as HTMLElement;
      const targetOuterX = (parent.getBoundingClientRect().left - this.drawingService.drawBoard.getBoundingClientRect().left);
      const targetOuterY =  (parent.getBoundingClientRect().top - this.drawingService.drawBoard.getBoundingClientRect().top);
      const targetOuterWidth =  parent.getBoundingClientRect().right - parent.getBoundingClientRect().left;
      const targetOuterHeight =  parent.getBoundingClientRect().bottom - parent.getBoundingClientRect().top;
      let isWithin = false;
      for (let i = x; i < (x + width); i++) {
        for (let j = y; j < (y + height); j++) {
          isWithin = (i >= targetOuterX) && (i <= (targetOuterX + targetOuterWidth)) &&
                     (j >= targetOuterY) && (j <= (targetOuterY + targetOuterHeight));
          if ( isWithin ) {
            this.addTarget(target.parentElement as HTMLElement);
            return;
          }
        }
      }
    });

  }

  onMouseMovement(event: MouseEvent): [string, string] {
    if (this.isSelecting) {
      this.updatePosition(event);
      this.selectionBox.dimensions[INDEX.X] = this.selectionBox.bottomRight[INDEX.X] - this.selectionBox.topLeft[INDEX.X];
      this.selectionBox.dimensions[INDEX.Y] = this.selectionBox.bottomRight[INDEX.Y] - this.selectionBox.topLeft[INDEX.Y];
      this.scan();
      this.updateSelectedZone();

      return ['selection',
              '<g id="selection' + '" x="' + this.selectionBox.topLeft[INDEX.X] + '" y="' + this.selectionBox.topLeft[INDEX.Y] +
              '" width="' + this.selectionBox.dimensions[INDEX.X] + '" height="' + this.selectionBox.dimensions[INDEX.Y] +
              '"  pointer-events= "none"><rect ' +
              '" x="' + (this.selectionBox.topLeft[INDEX.X]) +
              '" y="' + (this.selectionBox.topLeft[INDEX.Y]) +
              '" width="' + this.selectionBox.dimensions[INDEX.X] +
              '" height="' + this.selectionBox.dimensions[INDEX.Y] +
              '" fill="#00ffff" fill-opacity="0.10"' +
              '" stroke="black"' +
              ' stroke-dasharray="' + STROKE_DASH + '" pointer-events= "none"/>' + '</g>'
      ];
    }
    return ['selection', ''];
  }

  private initialiseSelection(event: MouseEvent): void {
    this.selectedBox = new Box();
    this.selectionBox.startPosition[INDEX.X] = event.offsetX + this.menuOffset - DRAWING_MENU_WIDTH;
    this.selectionBox.startPosition[INDEX.Y] = event.offsetY;
    if (this.button === 0) {
      this.targets[TARGET_INDEX.CURRENT].clear();
    } else {
      this.targets[TARGET_INDEX.TEMPORARY] = new Map<string, Element>(this.targets[TARGET_INDEX.CURRENT]);
    }
  }

  resetSelection(): void {
    this.targets[TARGET_INDEX.TEMPORARY] = new Map<string, Element>();
    this.targets[TARGET_INDEX.CURRENT] = new Map<string, Element>();
    this.updateSelectedZone();
  }

  addTarget(target: Element): boolean {
    const posibleSelections = target.id.includes('rect') ||
    target.id.includes('polygon') ||
    target.id.includes('pencil') ||
    target.id.includes('ellip') ||
    target.id.includes('brush') ||
    target.id.includes('spray') ||
    target.id.includes('line') ||
    target.id.includes('bucket');
    if (!target || target.id === 'drawboard' || !posibleSelections ) {
      return false;
    }

    if (this.button === MOUSE_BUTTON.LEFT) {
      if (!this.targets[TARGET_INDEX.CURRENT].has(target.id)) {
        this.targets[TARGET_INDEX.CURRENT].set(target.id, target);
        return true;
      }
    } else if ( this.button === MOUSE_BUTTON.RIGHT) {
      if (this.targets[TARGET_INDEX.CURRENT].has(target.id)) {
        this.targets[TARGET_INDEX.TEMPORARY].delete(target.id);
      } else {
        this.targets[TARGET_INDEX.TEMPORARY].set(target.id, target);
      }
      return true;
    }
    return false;
  }

  onMouseDown(event: MouseEvent, eventButton: number): [string, string] {
    this.isSelecting = true;
    this.button = eventButton;
    this.initialiseSelection(event);
    const target = event.target as Element;
    const targetP = target.parentElement as Element;
    if (!this.addTarget(targetP)) {
      (this.drawingService.selectedZone as Element).innerHTML = '';
    }
    this.updateSelectedZone();
    return ['', ''];
  }

  updateSelectedZone(): void {
    const showedTargets = (this.button === MOUSE_BUTTON.LEFT) ? this.targets[TARGET_INDEX.CURRENT] :
                                                                this.targets[TARGET_INDEX.TEMPORARY];

    this.updateTargets();
    if (showedTargets.size === 0) {
      if (this.drawingService.selectedZone) {
        this.drawingService.selectedZone.innerHTML = '';
      }
      return;
    }

    let currentX = 0;
    let currentY = 0;
    let yMax = 0;
    let xMax = 0;
    let yMin = 0;
    let xMin = 0;

    const firstTarget = showedTargets.values().next().value as Element;
    if (!this.drawingService.drawBoard) {
      return;
    }
    currentX = firstTarget.getBoundingClientRect().left - this.drawingService.drawBoard.getBoundingClientRect().left;
    currentY = firstTarget.getBoundingClientRect().top  - this.drawingService.drawBoard.getBoundingClientRect().top;
    yMax = firstTarget.getBoundingClientRect().top - this.drawingService.drawBoard.getBoundingClientRect().top +
           firstTarget.getBoundingClientRect().bottom - firstTarget.getBoundingClientRect().top;

    xMax =  firstTarget.getBoundingClientRect().left - this.drawingService.drawBoard.getBoundingClientRect().left +
            firstTarget.getBoundingClientRect().right - firstTarget.getBoundingClientRect().left;

    yMin = currentY;
    xMin = currentX;

    for (const target of showedTargets.values()) {
      currentX = target.getBoundingClientRect().left - this.drawingService.drawBoard.getBoundingClientRect().left;
      currentY = target.getBoundingClientRect().top  - this.drawingService.drawBoard.getBoundingClientRect().top;
      const currentMaxY = target.getBoundingClientRect().top - this.drawingService.drawBoard.getBoundingClientRect().top +
      target.getBoundingClientRect().bottom - target.getBoundingClientRect().top;

      const currentMaxX =  target.getBoundingClientRect().left - this.drawingService.drawBoard.getBoundingClientRect().left +
      target.getBoundingClientRect().right - target.getBoundingClientRect().left;

      yMax = (yMax < currentMaxY) ? currentMaxY : yMax;
      yMin = (yMin > currentY) ? currentY : yMin;
      xMax = (xMax < currentMaxX) ? currentMaxX : xMax;
      xMin = (xMin > currentX) ? currentX : xMin;
    }

    this.selectedBox.topLeft[0] = xMin;
    this.selectedBox.topLeft[1] = yMin;
    this.selectedBox.dimensions[0] = xMax - xMin;
    this.selectedBox.dimensions[1] = yMax - yMin;
    this.selectedBox.bottomRight[0] = xMax;
    this.selectedBox.bottomRight[1] = yMax;

    if (this.drawingService.selectedZone) {
      const halfControlPointSize = CONTROL_POINT_SIZE / 2;
      this.drawingService.selectedZone.innerHTML = '<rect id="selectedRect" x="' + xMin + '" y="' + yMin +
      '" width="' + (xMax - xMin) + '" height="' + (yMax - yMin) +
      '" fill="none" stroke= "#000000"' +
      'stroke-width= "1" stroke-dasharray= "2,2" stroke-linejoin= "round" pointer-events= "none"/>' +
      '<rect id="controlPointTop" fill="white" stroke="#000000" stroke-width="1" pointer-events="none"' +
      'x="' + (xMin - halfControlPointSize + (xMax - xMin) / 2) + '" y="' + (yMin - halfControlPointSize) + '" width="6" height="6"/>' +
      '<rect id="controlPointBot" fill="white" stroke="#000000" stroke-width="1" pointer-events="none"' +
      'x="' + (xMin - halfControlPointSize + (xMax - xMin) / 2) + '" y="' + (yMax - halfControlPointSize) + '" width="6" height="6"/>' +
      '<rect id="controlPointBot" fill="white" stroke="#000000" stroke-width="1" pointer-events="none"' +
      'x="' + (xMin - halfControlPointSize) + '" y="' + (yMin - halfControlPointSize  + (yMax - yMin) / 2) + '" width="6" height="6"/>' +
      '<rect id="controlPointBot" fill="white" stroke="#000000" stroke-width="1" pointer-events="none"' +
      'x="' + (xMax - halfControlPointSize) + '" y="' + (yMin - halfControlPointSize  + (yMax - yMin) / 2) + '" width="6" height="6"/>' ;
    }
  }

  onMouseUp(event: MouseEvent): [string, string] {
    this.isSelecting = false;
    if (this.button === MOUSE_BUTTON.RIGHT) {
      this.targets[TARGET_INDEX.CURRENT] = new Map<string, Element>(this.targets[TARGET_INDEX.TEMPORARY]);
    }
    this.targets[TARGET_INDEX.TEMPORARY] = new Map<string, Element>();
    this.button = 0;
    this.reinitiate();
    return ['selection', ''];
  }

  reinitiate(): void {
    if (!(this.drawingService.selectedZone && this.drawingService.drawBoard)) {
      return;
    }
    this.initialSelectedBox.topLeft[0] = this.drawingService.selectedZone.getBoundingClientRect().left -
                                         this.drawingService.drawBoard.getBoundingClientRect().left;
    this.initialSelectedBox.topLeft[1] = this.drawingService.selectedZone.getBoundingClientRect().top -
                                         this.drawingService.drawBoard.getBoundingClientRect().top;
    this.initialSelectedBox.bottomRight[0] = this.drawingService.selectedZone.getBoundingClientRect().right -
                                             this.drawingService.drawBoard.getBoundingClientRect().left;
    this.initialSelectedBox.bottomRight[1] = this.drawingService.selectedZone.getBoundingClientRect().bottom -
                                             this.drawingService.drawBoard.getBoundingClientRect().top;
    this.initialSelectedBox.dimensions[0] = this.initialSelectedBox.bottomRight[0] - this.initialSelectedBox.topLeft[0];
    this.initialSelectedBox.dimensions[1] = this.initialSelectedBox.bottomRight[1] - this.initialSelectedBox.topLeft[1];
  }

  onCtrlKey(event: KeyboardEvent): [string, string] {
    const elements = (this.drawingService.drawZone as Element).children;
    Array.from(elements).forEach((element) => this.targets[TARGET_INDEX.CURRENT].set(element.id, element));
    this.updateSelectedZone();
    return ['', ''];
  }

  updateTargets(): void {
    this.targets[TARGET_INDEX.CURRENT].forEach( (target) => {
      const newHtml = this.drawingService.getDrawingElementById(target.id);
      if (newHtml) {
        this.targets[TARGET_INDEX.CURRENT].set(target.id, newHtml);
      } else {
        this.targets[TARGET_INDEX.CURRENT].delete(target.id);
      }
    });
  }
}
