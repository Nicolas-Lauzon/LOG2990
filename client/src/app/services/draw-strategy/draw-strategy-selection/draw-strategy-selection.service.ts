import { Injectable } from '@angular/core';
import { DRAWING_MENU_WIDTH } from 'src/app/constants';
import { DataService } from '../../data-service/data.service';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawingService } from '../../drawing-service/drawing.service';
import { DrawStrategySprayService } from '../draw-startegy-spray/draw-strategy-spray.service';
import { DrawStrategyService } from '../draw-strategy';
import { DrawStrategyBrushService } from '../draw-strategy-brush/draw-strategy-brush.service';
import { DrawStrategyBucketService } from '../draw-strategy-bucket/draw-strategy-bucket.service';
import { DrawStrategyEllipseService } from '../draw-strategy-ellipse/draw-strategy-ellipse.service';
import { DrawStrategyPolygonService } from '../draw-strategy-polygon/draw-strategy-polygon.service';
import { DrawStrategyRectangleService } from '../draw-strategy-rectangle/draw-strategy-rectangle.service';
import { DrawStrategyLineService } from '../draw_strategy-line/draw-strategy-line.service';
import { DrawStrategyPencilService } from './../draw-strategy-pencil/draw-strategy-pencil.service';
import { ClipBoard } from './clipboard';
import { MOUSE_BUTTON } from './mouse-enum';
import { Selection } from './selection';
import { Transformation } from './transformation';

@Injectable({
  providedIn: 'root'
})
export class DrawStrategySelectionService implements DrawStrategyService {
  private selection: Selection;
  private transformation: Transformation;
  clipBoard: ClipBoard;
  targets: Map<string, Element>;
  isTransforming: boolean;
  firstClick: boolean;
  isShiftDown: boolean;
  isAltDown: boolean;
  tools: [DrawStrategyPencilService,
          DrawStrategyBrushService,
          DrawStrategySprayService,
          DrawStrategyLineService,
          DrawStrategyRectangleService,
          DrawStrategyEllipseService,
          DrawStrategyPolygonService,
          DrawStrategyBucketService];

  getSelectionStatus(): boolean {
  return this.selection.targets[0].size !== 0;
  }

  getCurrentId(): number {
    return 0;
  }

  setCurrentId(receivedId: number): void {
    return;
  }

  constructor(drawInvoker: DrawInvokerService,
              dataService: DataService,
              drawingService: DrawingService,
              drawStrategyLine: DrawStrategyLineService,
              drawPencilTool: DrawStrategyPencilService,
              drawBrushTool: DrawStrategyBrushService,
              drawRectangleTool: DrawStrategyRectangleService,
              drawEllipseTool: DrawStrategyEllipseService,
              drawPolygonTool: DrawStrategyPolygonService,
              drawSprayTool: DrawStrategySprayService,
              drawBucketTool: DrawStrategyBucketService) {
    this.targets = new Map<string, Element>();
    this.selection = new Selection(this.targets, drawingService);
    this.transformation = new Transformation(this.selection, drawInvoker, drawingService);
    this.isTransforming = false;
    this.firstClick = true;
    this.isShiftDown = false;
    this.isAltDown = false;
    this.tools = [drawPencilTool, drawBrushTool, drawSprayTool,
      drawStrategyLine, drawRectangleTool, drawEllipseTool,
      drawPolygonTool, drawBucketTool];
    this.clipBoard = new ClipBoard(drawingService, this.selection, this.transformation, drawInvoker, this.tools, dataService);
  }
  onSelected(): void {
    return;
  }
  resetSelection(): void {
    this.selection.resetSelection();
  }

  onMouseMovement(event: MouseEvent): [string, string] {

    if (this.isTransforming) {
      return this.transformation.onMouseMovement(event);
    }
    return this.selection.onMouseMovement(event);
  }

  onMouseDown(event: MouseEvent, eventButton: number): [string, string] {
    if (this.firstClick) {
      this.selection.menuOffset = ((event.target as HTMLElement).id === 'background') ? DRAWING_MENU_WIDTH : 0;
      this.firstClick = false;
    }
    if (eventButton !== MOUSE_BUTTON.RIGHT) {
      const targetParent = (event.target as Element).parentElement as Element;
      this.selection.addTarget(targetParent);
      if (this.selection.isWithinSelection(event)) {
        this.isTransforming = true;
        return this.transformation.onMouseDown(event, eventButton);
      }
    }
    return this.selection.onMouseDown(event, eventButton);
  }

  onMouseUp(event: MouseEvent): [string, string] {
    this.firstClick = true;
    let result: [string, string] = ['', ''];
    if (this.isTransforming) {
      result = this.transformation.onMouseUp();
    } else {
      result = this.selection.onMouseUp(event);
    }
    this.isTransforming = false;
    this.selection.reinitiate();
    return result;
  }

  onBackspace(event: MouseEvent): [string, string] {
    return ['', ''];
  }

  onWheel(event: WheelEvent): [string, string] {
    if (!this.isTransforming) {
      this.transformation.rotate(event, this.isShiftDown, this.isAltDown);
    }
    return ['', ''];
  }

  onEscape(event: MouseEvent): [string, string] {
    return ['', ''];
  }

  onShiftDown(event: MouseEvent): [string, string] {
    if (!this.isShiftDown) {
      this.isShiftDown = true;
      this.selection.reinitiate();
    }
    return ['', ''];
  }

  onShiftUp(event: MouseEvent): [string, string] {
    if (this.isShiftDown) {
      this.isShiftDown = false;
      this.selection.reinitiate();
    }
    return ['', ''];
  }

  onCtrlKey(event: KeyboardEvent): [string, string] {
    if (event.key === 'c' ) {
      return this.clipBoard.copy();
    }
    if (event.key === 'v' ) {
      return this.clipBoard.paste();
    }
    if (event.key === 'x' ) {
      return this.clipBoard.cut();
    }
    if (event.key === 'd' ) {
      return this.clipBoard.duplicate();
    }
    if (event.key === 'a') {
      return this.selection.onCtrlKey(event);
    }
    return ['', ''];
  }

  onMouseOut(event: MouseEvent): [string, string] {
    return ['', ''];
  }

  arrowKeyDown(event: KeyboardEvent): [string, string] {
    return this.transformation.arrowKeyDown(event);
  }

  arrowKeyUp(event: KeyboardEvent): [string, string] {
    return this.transformation.arrowKeyUp(event);
  }
}
