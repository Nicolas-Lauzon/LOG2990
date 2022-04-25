import { Injectable, Input } from '@angular/core';
import { DrawStrategyService } from 'src/app/services/draw-strategy/draw-strategy';
import { ColorPickerService } from '../color-picker/color-picker.service';
import { DataService } from '../data-service/data.service';
import { DrawStrategyBrushService } from '../draw-strategy/draw-strategy-brush/draw-strategy-brush.service';
import { DrawStrategyEllipseService } from '../draw-strategy/draw-strategy-ellipse/draw-strategy-ellipse.service';
import { DrawStrategyEraserService } from '../draw-strategy/draw-strategy-eraser/draw-strategy-eraser.service';
import { DrawStrategyPencilService } from '../draw-strategy/draw-strategy-pencil/draw-strategy-pencil.service';
import { DrawStrategyPolygonService } from '../draw-strategy/draw-strategy-polygon/draw-strategy-polygon.service';
import { DrawStrategyRectangleService } from '../draw-strategy/draw-strategy-rectangle/draw-strategy-rectangle.service';
import { DrawStrategySelectionService } from '../draw-strategy/draw-strategy-selection/draw-strategy-selection.service';
import { DrawStrategyLineService } from '../draw-strategy/draw_strategy-line/draw-strategy-line.service';
import { TOOLS_INDEX } from './../../enums';
import { DrawStrategySprayService } from './../draw-strategy/draw-startegy-spray/draw-strategy-spray.service';
import { DrawStrategyBucketService } from './../draw-strategy/draw-strategy-bucket/draw-strategy-bucket.service';
import { DrawStrategyColorApplicatorService
  } from './../draw-strategy/draw-strategy-color-applicator/draw-strategy-color-applicator.service';
import { DrawingService } from './../drawing-service/drawing.service';

@Injectable({
  providedIn: 'root',
})
export class DrawBoardStateService {
  activeTool: {tool: DrawStrategyService | undefined, activeToolIndex: number };
  tools: (DrawStrategyService | undefined)[] = [];
  lastMouseMovementEvent: MouseEvent[];
  toolsShortcut: Map<string, TOOLS_INDEX>;

  private services: {drawingService: DrawingService, dataService: DataService};
  @Input() drawboard: HTMLElement | null;
  @Input() drawZone: HTMLElement | null;

  constructor(
    selectionTool: DrawStrategySelectionService,
    drawStrategyLine: DrawStrategyLineService,
    drawPencilTool: DrawStrategyPencilService,
    drawBrushTool: DrawStrategyBrushService,
    drawRectangleTool: DrawStrategyRectangleService,
    drawEllipseTool: DrawStrategyEllipseService,
    drawPolygonTool: DrawStrategyPolygonService,
    drawSprayTool: DrawStrategySprayService,
    drawEraserTool: DrawStrategyEraserService,
    colorPicker: ColorPickerService,
    dataService: DataService,
    colorApplicator: DrawStrategyColorApplicatorService,
    drawingService: DrawingService,
    bucket: DrawStrategyBucketService
    ) {
    this.toolsShortcut = new Map<string, TOOLS_INDEX>( [['s', TOOLS_INDEX.SELECTION], ['c', TOOLS_INDEX.PENCIL], ['w', TOOLS_INDEX.BRUSH],
                                                        ['e', TOOLS_INDEX.ERASER], ['l', TOOLS_INDEX.LINE], ['1', TOOLS_INDEX.RECTANGLE],
                                                        ['2', TOOLS_INDEX.ELLIPSE], ['3', TOOLS_INDEX.POLYGON], ['a', TOOLS_INDEX.SPRAY],
                                                        ['i', TOOLS_INDEX.PICKER], ['r', TOOLS_INDEX.APPLICATOR],
                                                        ['b', TOOLS_INDEX.BUCKET]]);
    this.tools.push(selectionTool);
    this.tools.push(drawPencilTool);
    this.tools.push(drawBrushTool);
    this.tools.push(drawEraserTool);
    this.tools.push(drawStrategyLine);
    this.tools.push(drawRectangleTool);
    this.tools.push(drawEllipseTool);
    this.tools.push(drawPolygonTool);
    this.tools.push(drawSprayTool);

    this.tools.push(colorPicker);
    this.tools.push(undefined);
    this.tools.push(colorApplicator);
    this.tools.push(bucket);

    this.activeTool = {tool: drawPencilTool, activeToolIndex: 1};
    this.services = {drawingService, dataService};
    this.lastMouseMovementEvent = new Array<MouseEvent>();
    this.drawZone = null;
    this.drawboard = null;
  }

  quickSave(): void {
    if (this.drawboard) {
      this.services.dataService.changeDraw(this.drawboard.innerHTML);
    }
  }

  quickLoad(): void {
    if (this.drawboard) {
      this.services.dataService.drawCurrent.subscribe((message) => ((this.drawboard as HTMLElement).innerHTML = message));
      const drawzone = document.getElementById('drawZone');
      this.drawZone = drawzone;
      this.services.drawingService.drawZone = drawzone;
    }
  }

  onMouseDown(event: MouseEvent): void {

    if (this.activeTool.tool !== undefined) {
      this.replaceTag(this.activeTool.tool.onMouseDown(this.lastMouseMovementEvent[0], event.button));
    }

  }

  onMouseUp(event: MouseEvent): void {
    if (this.activeTool.tool !== undefined) {
      this.replaceTag(this.activeTool.tool.onMouseUp(event));
    }
  }

  onMouseOut(event: MouseEvent): void {
    if (this.activeTool.tool !== undefined) {
      this.replaceTag(this.activeTool.tool.onMouseOut(event));
    }
  }
  changeActiveTool(index: number): void {
    this.activeTool.tool = this.tools[index];
    this.activeTool.activeToolIndex = index;
    if (this.activeTool.activeToolIndex !== TOOLS_INDEX.GRID) {
      (this.activeTool.tool as DrawStrategyService).onSelected();
    }
  }

  onMouseMovement(event: MouseEvent): void {
    this.lastMouseMovementEvent[1] = this.lastMouseMovementEvent[0];
    this.lastMouseMovementEvent[0] = event;

    if (this.activeTool.tool !== undefined) {
      this.replaceTag(this.activeTool.tool.onMouseMovement(event));
    }
  }

  toolChangeSwitchCase(event: KeyboardEvent): boolean {
    if (this.toolsShortcut.has(event.key)) {
      this.changeActiveTool(this.toolsShortcut.get(event.key) as TOOLS_INDEX);
      return true;
    }
    return false;
  }

  onKeyDown(event: KeyboardEvent): void {

    if (event.ctrlKey) {
      (this.activeTool.tool as DrawStrategyService).onCtrlKey(event);
      return;
    }

    if (this.toolChangeSwitchCase(event)) {
      return;
    }

    switch (event.key) {
      case 'Backspace':
        if (this.activeTool.tool !== undefined) {
          this.replaceTag(this.activeTool.tool.onBackspace(this.lastMouseMovementEvent[0]));
        }
        break;
      case 'Escape':
        if (this.activeTool.tool !== undefined) {
          this.replaceTag(this.activeTool.tool.onEscape(this.lastMouseMovementEvent[0]));
        }
        break;
      case 'Shift':
        if (this.activeTool.tool !== undefined) {
          this.replaceTag(this.activeTool.tool.onShiftDown(this.lastMouseMovementEvent[1]));
        }
        break;
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Shift':
        if (this.activeTool.tool !== undefined) {
          this.replaceTag(this.activeTool.tool.onShiftUp(this.lastMouseMovementEvent[0]));
        }
        break;
    }
  }

  replaceTag(idTagPair: [string, string]): void {
    if (this.drawZone) {
      if (idTagPair[0]) {
        const destination = this.drawZone.querySelector('#' + idTagPair[0]);
        if (destination) {
          destination.outerHTML = idTagPair[1];
        } else {
          this.drawZone.innerHTML += idTagPair[1];
        }
      }
    }
  }
}
