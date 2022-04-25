import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, } from '@angular/core';
import { TOOLS_INDEX } from 'src/app/enums';
import { LoadService } from 'src/app/services/automatic-save-service/load-service/load.service';
import { DataService } from '../../../../services/data-service/data.service';
import { DrawStrategyEraserService } from '../../../../services/draw-strategy/draw-strategy-eraser/draw-strategy-eraser.service';
import { DrawBoardStateService } from './../../../../services/draw-board-state/draw-board-state.service';
import { DrawingService } from './../../../../services/drawing-service/drawing.service';
import { GridService } from './../../../../services/grid-service/grid.service';
import { IntervalService } from './../../../../services/interval-service/interval.service';

@Component({
  selector: 'app-drawing_space',
  templateUrl: './drawing-space.component.html',
  styleUrls: ['./drawing-space.component.css'],
})
export class DrawingSpaceComponent implements OnInit, OnDestroy, AfterContentInit {
  dimensions: number[];
  color: string;
  elementRef: ElementRef;
  draw: string;
  timer: number;
  lastCoord: MouseEvent;

  private drawingState: boolean[];

  private services: {
    drawBoardStateService: DrawBoardStateService,
    intervalService: IntervalService,
    drawingService: DrawingService,
    dataService: DataService,
    gridService: GridService,
    eraserService: DrawStrategyEraserService,
    automaticSave: LoadService};

  constructor(elRef: ElementRef,
              data: DataService,
              drawBoardState: DrawBoardStateService,
              interval: IntervalService, grid: GridService,
              drawing: DrawingService, eraser: DrawStrategyEraserService, save: LoadService) {
    this.services = {
      drawBoardStateService: drawBoardState,
      intervalService: interval,
      drawingService: drawing,
      dataService: data,
      gridService: grid,
      eraserService: eraser,
      automaticSave: save
    };
    this.drawingState = new Array<boolean>(2).fill(false);
    this.dimensions = new Array<number>(2);
    this.elementRef = elRef;
    this.draw = '';
    this.color = '#ffffff';
    window.onload = () => this.services.gridService.showGrid();
  }

  ngOnInit(): void {
    this.services.dataService.dimensionXCurrent.subscribe((message) => (this.dimensions[0] = message));
    this.services.dataService.dimensionYCurrent.subscribe((message) => (this.dimensions[1] = message));
    this.services.dataService.colorCurrent.subscribe((message) => (this.color = message));
    this.services.dataService.drawCurrent.subscribe((message) => (this.draw = message));
    const svg = this.elementRef.nativeElement.querySelector('#svg');

    let dimXS: string = this.dimensions[0].toString();
    dimXS += 'px';
    let dimYS: string = this.dimensions[1].toString();
    dimYS += 'px';

    const drawZone = this.elementRef.nativeElement.querySelector('#drawZone');
    const drawboard = this.elementRef.nativeElement.querySelector('#drawboard');
    const selectedZone = this.elementRef.nativeElement.querySelector('#selectedZone');
    const cursorSquare = this.elementRef.nativeElement.querySelector('#cursorSquare');
    this.services.drawBoardStateService.drawZone = drawZone;
    this.services.drawBoardStateService.drawboard = drawboard;
    this.services.automaticSave.automaticSave.elRef = drawboard;

    this.services.drawingService.drawZone = drawZone;
    this.services.drawingService.svg = svg;
    this.services.drawingService.selectedZone = selectedZone;
    this.services.drawingService.cursorSquare = cursorSquare;
    this.services.drawingService.drawBoard = drawboard;

    if (this.services.drawBoardStateService.drawboard && this.services.drawBoardStateService.drawZone) {
      this.services.drawBoardStateService.drawZone.style.minWidth = dimXS;
      this.services.drawBoardStateService.drawZone.style.minHeight = dimYS;
      this.services.drawBoardStateService.drawboard.style.minWidth = dimXS;
      this.services.drawBoardStateService.drawboard.style.minHeight = dimYS;
    }
  }

  ngAfterContentInit(): void {
    if (this.services.drawBoardStateService.drawboard) {
      this.services.drawBoardStateService.drawboard.innerHTML = this.draw;
      this.services.automaticSave.automaticSave.firstSave();
      this.services.automaticSave.load();
    }
  }

  ngOnDestroy(): void {
    this.services.drawBoardStateService.quickSave();
    this.services.automaticSave.automaticSave.undoRedoSave();
  }

  onMouseDown(event: MouseEvent): void {
    this.lastCoord = event;
    this.services.drawBoardStateService.onMouseDown(event);
    if (!this.drawingState[1] ) {
      this.switchLastCall();
    }
  }

  onMouseMovement(event: MouseEvent): void {
    this.lastCoord = event;
    this.services.drawBoardStateService.onMouseMovement(event);
    if (this.drawingState[0] && this.drawingState[1] ) {
      clearInterval(this.timer);
      this.switchLastCall();
    }

  }

  onMouseUp(event: MouseEvent): void {
    this.drawingState[1] = false;
    this.drawingState[0] = false;
    clearInterval(this.timer);
    this.services.drawBoardStateService.onMouseUp(event);
  }

  onMouseOut(event: MouseEvent): void {
    this.drawingState[1] = false;
    clearInterval(this.timer);
    this.services.drawBoardStateService.onMouseOut(event);
  }

  switchLastCall(): void {
    if (this.services.drawBoardStateService.activeTool.activeToolIndex === TOOLS_INDEX.SPRAY) {
      this.timer = window.setInterval(() => { this.onMouseDown(this.lastCoord); }, this.services.intervalService.value);
      this.drawingState[1] = !this.drawingState[1];
    }
  }
}
