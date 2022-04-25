import { DRAWING_MENU_WIDTH } from 'src/app/constants';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawingService } from '../../drawing-service/drawing.service';
import { Box } from './../box';
import { EraserStyler } from './eraser-styler';

enum INDEX {
  X = 0,
  Y = 1
}

const INITIAL_WIDTH = 3;
export class EraserSelection {
  private drawingService: DrawingService;
  private drawingInvoker: DrawInvokerService;
  eraserBox: Box;
  targets: Map<string, Element>;
  topMostElement: Element | null;
  private styler: EraserStyler;
  private elementErased: Element[];

  constructor(styler: EraserStyler, drawingService: DrawingService, drawingInvoker: DrawInvokerService) {
    this.styler = styler;
    this.topMostElement = null;
    this.elementErased = [];
    this.eraserBox = new Box();
    this.eraserBox.topLeft = [0, 0];
    this.eraserBox.bottomRight = [0, 0];
    this.eraserBox.dimensions = [INITIAL_WIDTH, INITIAL_WIDTH];
    this.drawingInvoker = drawingInvoker;
    this.drawingService = drawingService;
    this.targets = new Map<string, Element>();
  }

  onMouseOut(event: MouseEvent): [string, string] {
    if (this.drawingService.cursorSquare) {
      this.drawingService.cursorSquare.innerHTML = '';
    }
    return ['', ''];
  }

  onMouseMovement(event: MouseEvent): [string, string] {
    this.eraserBox.topLeft = [event.clientX - this.eraserBox.dimensions[INDEX.X] / 2,
                              event.clientY - this.eraserBox.dimensions[INDEX.Y] / 2];

    this.eraserBox.bottomRight = [event.clientX + this.eraserBox.dimensions[INDEX.X] / 2,
                                  event.clientY + this.eraserBox.dimensions[INDEX.Y] / 2];
    this.cursorSquare(event);
    this.squareSelect(event);
    this.styler.changeStyle();
    return ['', ''];
  }

  onMouseDown(event: MouseEvent): void {
    this.squareSelect(event);
    if (this.topMostElement) {
      const id = this.topMostElement.id;
      this.targets.clear();
      this.styler.restoreStyle();
      this.elementErased.push(this.topMostElement);
      this.topMostElement = null;
      this.styler.topMostElement = null;
      this.styler.memoriseStyle();
      this.drawingService.replaceTag([id, '']);
      this.squareSelect(event);
      this.styler.changeStyle();
    }

  }

  onMouseUp(event: MouseEvent): [string, string] {
    this.cursorSquare(event);
    const command = new Array<[string, string, string]>();
    this.elementErased.forEach((element) => {
      command.push([element.id, '', element.outerHTML]);
    });
    this.drawingInvoker.do(command);
    this.elementErased = [];
    return ['', ''];
  }

  eraseSelection(): [string, string] {

    if (this.topMostElement) {
      const id = this.topMostElement.id;
      this.targets.clear();
      this.styler.restoreStyle();
      this.elementErased.push(this.topMostElement);
      this.topMostElement = null;
      this.styler.topMostElement = null;
      this.styler.memoriseStyle();
      return [id, ''];
    }
    return ['', ''];
  }

  private cursorSquare(event: MouseEvent): void {
    if (this.drawingService.cursorSquare) {
      this.drawingService.cursorSquare.innerHTML = '<rect width="' + this.eraserBox.dimensions[INDEX.X] +
        '" height="' + this.eraserBox.dimensions[INDEX.Y] + '" pointer-events= "none" fill="#ffffffaa" stroke="black" x="' +
        (event.offsetX - this.eraserBox.dimensions[INDEX.X] / 2) +
        '" y="' + (event.offsetY - this.eraserBox.dimensions[INDEX.Y] / 2) + '">';
    }
  }

  private elementsWithinRange(): NodeListOf<Element> {
    const svg  = this.drawingService.svg as SVGSVGElement;
    const draw  = svg.querySelector('#drawZone') as SVGElement;

    const x = this.eraserBox.topLeft[INDEX.X] - DRAWING_MENU_WIDTH;
    const width = this.eraserBox.dimensions[INDEX.X];
    const y = this.eraserBox.topLeft[INDEX.Y];
    const height = this.eraserBox.dimensions[INDEX.Y];

    const rect = svg.createSVGRect() as SVGRect;
    rect.x = x;
    rect.y = y;
    rect.width = width;
    rect.height = height;
    return svg.getIntersectionList(rect , draw );
  }

  private memoriseTargets(list: NodeList): void {
    this.targets.clear();
    list.forEach((element) => {
      const parent = element.parentElement as Element;
      this.targets.set(parent.id, parent);
    });
  }

  private findTopMostWithinRange(): Element | null {
    let getOut = false;
    let tempTopMost: Element | null = null;
    do {
      tempTopMost = this.findTopMost();
      getOut = this.searchElement(tempTopMost);
      if (!getOut && tempTopMost) {
        this.targets.delete(tempTopMost.id);
      }
    } while (!getOut);

    return tempTopMost;
  }

  private squareSelect(event: MouseEvent): void {
    const list = this.elementsWithinRange();
    this.listSelect(list);
  }

  private listSelect(list: NodeList): void {
    if (!list.length) {
      this.styler.restoreStyle();
      this.topMostElement = null;
      this.styler.topMostElement = null;
      this.styler.memoriseStyle();
      return;
    }
    this.memoriseTargets(list);
    this.styler.restoreStyle();
    this.topMostElement = this.findTopMostWithinRange();
    this.styler.topMostElement = this.topMostElement;
    this.styler.memoriseStyle();
  }

  searchScanX(from: number, to: number, forY: number, elementToFind: Element): boolean {
    for (let i = from; i < to; i++) {
      const directTarget = (document.elementFromPoint(i, forY) as Element);
      const targetP = directTarget ? directTarget.parentElement : null;
      if ((targetP && targetP.id !== 'drawboard')) {
        if ((elementToFind.id === (targetP as Element).id)) {
          return true;
        }
      }
    }
    return false;
  }

  searchScanY(from: number, to: number, forX: number, elementToFind: Element): boolean {
    for (let i = from; i < to; i++) {
      const directTarget = (document.elementFromPoint(forX, i) as Element);
      const targetP = directTarget ? directTarget.parentElement : null;
      if ((targetP && targetP.id !== 'drawboard')) {
        if ((elementToFind.id === (targetP as Element).id)) {
          return true;
        }
      }
    }
    return false;
  }

  private minBoundarie(from: number, to: number, value: number): number {
    if (value > from && value < to) {
      return value;
    }
    return from;
  }

  private maxBoundarie(from: number, to: number, value: number): number {
    if (value > from && value < to) {
      return value;
    }
    return to;
  }

  isSearchedElementEnclosed(searchedElement: Element): boolean {
    const svg  = this.drawingService.svg as SVGSVGElement;
    const draw  = svg.querySelector('#drawZone') as SVGElement;

    const x = this.eraserBox.topLeft[INDEX.X] - DRAWING_MENU_WIDTH;
    const width = this.eraserBox.dimensions[INDEX.X];
    const y = this.eraserBox.topLeft[INDEX.Y];
    const height = this.eraserBox.dimensions[INDEX.Y];

    const rect = svg.createSVGRect() as SVGRect;
    rect.x = x;
    rect.y = y;
    rect.width = width;
    rect.height = height;

    const enclosedElements = svg.getEnclosureList(rect , draw );
    return this.elementInEnclosure(enclosedElements, searchedElement);
  }

  private elementInEnclosure(enclosedElements: NodeList, searchedElement: Element): boolean {
    let found = false;
    enclosedElements.forEach((currentEnclosedElement) => {
      const parent = currentEnclosedElement.parentElement;
      if (parent && parent.id === searchedElement.id) {
        found = true;
      }
    });
    return found;
  }

  private searchElement(element: Element | null): boolean {
    if (!element) {
      return true;
    }
    let found = this.isSearchedElementEnclosed(element);
    if (found) {
      return found;
    }

    const clientRect = element.getBoundingClientRect();
    const scanX = this.minBoundarie(this.eraserBox.topLeft[INDEX.X], this.eraserBox.bottomRight[INDEX.X], clientRect.left);
    const scanMaxX = this.maxBoundarie(this.eraserBox.topLeft[INDEX.X], this.eraserBox.bottomRight[INDEX.X], clientRect.right);
    const scanY = this.minBoundarie(this.eraserBox.topLeft[INDEX.Y], this.eraserBox.bottomRight[INDEX.Y], clientRect.top);
    const scanMaxY = this.maxBoundarie(this.eraserBox.topLeft[INDEX.Y], this.eraserBox.bottomRight[INDEX.Y], clientRect.bottom);

    const xStart = Math.min(scanX, scanMaxX);
    const xEnd = Math.max(scanX, scanMaxX);
    const yStart = Math.min(scanY, scanMaxY);
    const yEnd = Math.max(scanY, scanMaxY);

    found = this.searchScanX(xStart, xEnd, yStart, element);
    if (found) {
      return found;
    }

    found = this.searchScanX(xStart, xEnd, yEnd, element);
    if (found) {
      return found;
    }

    found = this.searchScanY(yStart, yEnd, xStart, element);
    if (found) {
      return found;
    }

    found = this.searchScanY(yStart, yEnd, xEnd, element);
    if (found) {
      return found;
    }

    return found;
  }

  private findTopMost(): Element | null {

    if (this.targets.size === 0) {
      this.styler.restoreStyle();
      return null;
    }

    const drawings = (this.drawingService.drawZone as HTMLElement).children;
    let i = 0;
    let result: Element | null = null;
    while (i < drawings.length) {
      if (this.targets.has(drawings[i].id)) {
        result = drawings[i];
      }
      i++;
    }

    return result;

  }

}
