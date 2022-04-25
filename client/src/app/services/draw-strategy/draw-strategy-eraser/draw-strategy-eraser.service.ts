import { Injectable } from '@angular/core';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawingService } from '../../drawing-service/drawing.service';
import { DrawStrategyService } from '../draw-strategy';
import { EraserSelection } from './eraser-selection';
import { EraserStyler } from './eraser-styler';

@Injectable({
  providedIn: 'root'
})

export class DrawStrategyEraserService implements DrawStrategyService {
  private isPainting: boolean;
  private styler: EraserStyler;
  selection: EraserSelection;

  constructor(drawingService: DrawingService, drawingInvoker: DrawInvokerService) {
    this.isPainting = false;
    this.styler = new EraserStyler(drawingService);
    this.selection = new EraserSelection(this.styler, drawingService, drawingInvoker);
  }

  onMouseMovement(event: MouseEvent): [string, string] {
    this.selection.onMouseMovement(event);
    if (this.isPainting) {
      return this.selection.eraseSelection();
    }

    return ['', ''];
  }

  onMouseDown(event: MouseEvent): [string, string] {
    this.isPainting = true;
    this.selection.onMouseDown(event);
    return ['', ''];
  }
  onSelected(): void {
    return;
  }
  onMouseUp(event: MouseEvent): [string, string] {
    this.isPainting = false;
    return this.selection.onMouseUp(event);
  }

  onMouseOut(event: MouseEvent): [string, string] {
    this.isPainting = false;
    return this.selection.onMouseOut(event);
  }

  onBackspace(event: MouseEvent): [string, string] {
    return ['', ''];
  }
  onEscape(): [string, string] {
    return ['', ''];
  }

  onShiftDown(event: MouseEvent): [string, string] {
    return ['', ''];
  }
  onShiftUp(event: MouseEvent): [string, string] {
    return ['', ''];
  }

  onCtrlKey(event: KeyboardEvent): [string, string] {
    return ['', ''];
  }

  getCurrentId(): number {
    return 0;
  }

  setCurrentId(receivedId: number): void {
    return;
  }
}
