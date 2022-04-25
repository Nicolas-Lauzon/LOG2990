import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawingService } from '../../drawing-service/drawing.service';
import { INDEX } from '../box';
import { Selection, TARGET_INDEX } from './selection';

const ANGLE_DELTA = 15;

enum ARROW {
  LEFT = 'ArrowLeft',
  UP = 'ArrowUp',
  RIGHT = 'ArrowRight',
  DOWN = 'ArrowDown',
  CONTINUOUS = 'isContinuous'
}

enum TIMERS_INDEX {
  TIMEOUT = 0,
  INTERVAL = 1,
}

const CONTROL_POINT_SIZE = 5;
const TIMEOUT_DURATION = 400;
const INTERVAL_DURATION = 100;

export class Transformation {
  private drawInvoker: DrawInvokerService;
  private drawingService: DrawingService;
  private selection: Selection;

  private lastPosition: MouseEvent;
  private arrows: Map<string, boolean>;
  private timers: number[];
  lastCommand: Map<string, [string, string, string]>;

  constructor(selection: Selection,
              drawInvoker: DrawInvokerService,
              drawingService: DrawingService) {
    this.timers = [0, 0];
    this.drawingService = drawingService;
    this.lastCommand = new Map<string, [string, string, string]>();
    this.drawInvoker = drawInvoker;
    this.arrows = new Map([[ARROW.LEFT, false],
                           [ARROW.UP, false],
                           [ARROW.RIGHT, false],
                           [ARROW.DOWN, false],
                           [ARROW.CONTINUOUS, false]]);

    this.selection = selection;
  }

  onMouseDown(event: MouseEvent, eventButton: number): [string, string] {
    this.lastPosition = event;
    const target = event.target as Element;
    const targetP = target.parentElement as Element;
    this.addTarget(targetP);
    this.selection.updateSelectedZone();
    this.memoriseHtmls();

    return ['', ''];
  }

  memoriseHtmls(): void {
    this.selection.targets[TARGET_INDEX.CURRENT].forEach( (target) => {
        this.lastCommand.set(target.id, [target.id, target.outerHTML, target.outerHTML]);
    });
  }

  onMouseUp(): [string, string] {
    this.drawInvoker.do(Array.from(this.lastCommand.values()));
    this.lastCommand.clear();
    return ['', ''];
  }

  onMouseMovement(event: MouseEvent): [string, string] {
    const dX = (event.clientX - this.lastPosition.clientX);
    const dY = (event.clientY - this.lastPosition.clientY);
    this.translate(dX, dY);
    this.selection.updateSelectedZone();
    this.lastPosition = event;
    return ['selection', ''];
  }

  private addTarget(target: Element): boolean {
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

    this.selection.targets[TARGET_INDEX.CURRENT].clear();
    this.selection.targets[TARGET_INDEX.CURRENT].set(target.id, target);

    return false;
  }

  arrowKeyDown(event: KeyboardEvent): [string, string] {

    if (this.arrows.get(event.key)) {
      return ['', ''];
    }

    if (!this.checkArrows()) {
      this.selection.updateTargets();
      this.memoriseHtmls();
    }

    this.arrows.set(event.key, true);
    this.keyBoardMove();
    if (!this.arrows.get(ARROW.CONTINUOUS)) {
      this.setArrowPressTimeout();
    }
    this.selection.updateSelectedZone();
    return ['', ''];
  }

  setArrowPressTimeout(): void {
    this.timers[TIMERS_INDEX.TIMEOUT] = window.setTimeout(() => {
      this.arrows.set(ARROW.CONTINUOUS, true);
      this.setArrowPressInterval(); }, TIMEOUT_DURATION);

  }

  setArrowPressInterval(): void {
    this.timers[TIMERS_INDEX.INTERVAL] = window.setInterval(() => {
        this.checkTimers();
        if (this.arrows.get(ARROW.CONTINUOUS)) {
          this.keyBoardMove();
          this.selection.updateSelectedZone();
        } else {
          clearInterval(this.timers[TIMERS_INDEX.INTERVAL]);
        }
      },
      INTERVAL_DURATION);
  }

  keyBoardMove(): void {
    let dY = 0;
    dY = (this.arrows.get(ARROW.UP)) ? dY - CONTROL_POINT_SIZE / 2 : dY;
    dY = (this.arrows.get(ARROW.DOWN)) ? dY + CONTROL_POINT_SIZE / 2 : dY;
    let dX = 0;
    dX = (this.arrows.get(ARROW.LEFT)) ? dX - CONTROL_POINT_SIZE / 2 : dX;
    dX = (this.arrows.get(ARROW.RIGHT)) ? dX + CONTROL_POINT_SIZE / 2 : dX;
    this.translate(dX, dY);

  }

  translate(dX: number, dY: number): void {
    for (const target of this.selection.targets[TARGET_INDEX.CURRENT].entries()) {
      const directTarget = this.drawingService.getDrawingElementById(target[1].id) as SVGGraphicsElement;
      if (directTarget) {
        const matrix = directTarget.getCTM() as DOMMatrix;

        matrix.e += dX;
        matrix.f += dY;

        let transform = directTarget.getAttribute('transform');
        let translate = 'translate(0, 0)';
        translate = 'matrix(' + matrix.a + ' ' + matrix.b + ' ' + matrix.c + ' ' + matrix.d + ' ' + matrix.e + ' ' + matrix.f + ')';
        if (!transform) {
          transform = '';
        }
        directTarget.setAttribute('transform', translate);
        this.selection.targets[TARGET_INDEX.CURRENT].set(directTarget.id, directTarget);
        const pastTargetCommand = this.lastCommand.get(directTarget.id) as [string, string, string];
        this.lastCommand.set(directTarget.id, [directTarget.id, directTarget.outerHTML, pastTargetCommand[2]]);
      } else {
        this.selection.targets[TARGET_INDEX.CURRENT].delete(target[0]);
        this.lastCommand.delete(target[0]);
      }
    }
  }

  rotate(event: WheelEvent, isShiftDown: boolean, isAltDown: boolean): void {
    this.memoriseHtmls();
    let degree = 0;
    let xMiddle = this.selection.initialSelectedBox.topLeft[INDEX.X] + this.selection.initialSelectedBox.dimensions[INDEX.X] / 2;
    let yMiddle = this.selection.initialSelectedBox.topLeft[INDEX.Y] + this.selection.initialSelectedBox.dimensions[INDEX.Y] / 2;

    if (isAltDown) {
      degree = 1 * Math.sign(event.deltaY);
    } else {
      degree = ANGLE_DELTA * Math.sign(event.deltaY);
    }

    for (const target of this.selection.targets[TARGET_INDEX.CURRENT].entries()) {
      const directTarget = this.drawingService.getDrawingElementById(target[1].id) as SVGGraphicsElement;
      if (directTarget) {
        let transform = directTarget.getAttribute('transform');
        if (isShiftDown) {
          xMiddle = Number(directTarget.getAttribute('x')) + Number(directTarget.getAttribute('width')) / 2;
          yMiddle = Number(directTarget.getAttribute('y')) + Number(directTarget.getAttribute('height')) / 2;
        }

        const rotation = 'rotate(' + degree + ', ' + xMiddle + ', ' + yMiddle + ')';

        if (!transform) {
          transform = '';
        }

        if (isShiftDown) {
          directTarget.setAttribute('transform', transform + ' ' + rotation);
        } else {
          directTarget.setAttribute('transform', rotation + ' ' + transform );
        }

        this.selection.targets[TARGET_INDEX.CURRENT].set(directTarget.id, directTarget);
        const pastTargetCommand = this.lastCommand.get(directTarget.id) as [string, string, string];
        this.lastCommand.set(directTarget.id, [directTarget.id, directTarget.outerHTML, pastTargetCommand[2]]);

      } else {
        this.selection.targets[TARGET_INDEX.CURRENT].delete(target[0]);
        this.lastCommand.delete(target[0]);
      }
    }
    this.translate(0, 0);
    this.selection.updateSelectedZone();
    this.drawInvoker.do(Array.from(this.lastCommand.values()));
    this.lastCommand.clear();
  }

  arrowKeyUp(event: KeyboardEvent): [string, string] {

    if (this.arrows.has(event.key)) {
      this.arrows.set(event.key, false);
    }

    if (!this.checkArrows()) {
      this.drawInvoker.do(Array.from(this.lastCommand.values()));
      this.lastCommand.clear();
    }

    return ['', ''];
  }

  checkArrows(): boolean {
    const arrowDown = (this.arrows.get(ARROW.LEFT) ||
                    this.arrows.get(ARROW.UP) ||
                    this.arrows.get(ARROW.RIGHT) ||
                    this.arrows.get(ARROW.DOWN)) as boolean;

    return arrowDown;
  }

  checkTimers(): void {
    if (!(this.checkArrows())) {
      this.arrows.set(ARROW.CONTINUOUS, false);
      clearInterval(this.timers[TIMERS_INDEX.TIMEOUT]);
      clearInterval(this.timers[TIMERS_INDEX.INTERVAL]);
    }

  }
}
