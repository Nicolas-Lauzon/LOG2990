import { Component, ElementRef, HostListener } from '@angular/core';
import { DataService } from 'src/app/services/data-service/data.service';
import { DrawBoardStateService } from 'src/app/services/draw-board-state/draw-board-state.service';
import { DrawInvokerService } from 'src/app/services/draw-invoker-service/draw-invoker.service';
import { DrawStrategySelectionService } from 'src/app/services/draw-strategy/draw-strategy-selection/draw-strategy-selection.service';
import { SERVICE } from '../save-drawing/save-drawing.component';
import { COLOR_ICON_INDEX, DRAWING_ICON_INDEX, EXTERNAL_SERVICES_INDEX, ICON_STATE_INDEX,
         LAST_SELECTED_TOOL_INDEX, MODALES_INSTANCES_INDEX, SELECTION_MENU_INDEX, SHAPE_ICON_INDEX,
         SIDEBAR_ICON_INDEX,
         TOOLS_INDEX} from './../../../enums';
import { ExportDrawingService } from './../../../services/export-drawing-service/export-drawing.service';
import { GridService } from './../../../services/grid-service/grid.service';
import { IconState } from './icon-state';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  externalServices: [DrawBoardStateService, DataService, DrawInvokerService, DrawStrategySelectionService,
    GridService, ExportDrawingService];

  modalesInstances: boolean[];
  index: number[];
  iconsStates: (IconState[])[];
  elementRef: ElementRef;
  lastSelectedTool: number[];

  position: [number, number];

  constructor(elRef: ElementRef, drawBoardService: DrawBoardStateService, data: DataService, grid: GridService,
              selectionService: DrawStrategySelectionService, drawInvoker: DrawInvokerService, exportDrawing: ExportDrawingService) {
    this.externalServices = [drawBoardService, data, drawInvoker, selectionService, grid, exportDrawing];
    this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].changeActiveTool(TOOLS_INDEX.PENCIL);
    this.lastSelectedTool = [DRAWING_ICON_INDEX.PENCIL, SHAPE_ICON_INDEX.LINE, COLOR_ICON_INDEX.BUCKET];
    this.index = [SIDEBAR_ICON_INDEX.DRAWING , TOOLS_INDEX.PENCIL];
    this.modalesInstances = [false, false, false, false, false];
    this.elementRef = elRef;

    this.position = [0, 0];
    this.iconsStates = [[
      {iconState: '', iconSrc: '', associatedIndex: SIDEBAR_ICON_INDEX.SELECTION},
      {iconState: ' active',
      iconSrc: '../../../assets/pencil_icon.svg',
      associatedIndex: SIDEBAR_ICON_INDEX.DRAWING},
      {iconState: '',
      iconSrc: '../../../assets/line_icon.svg',
      associatedIndex: SIDEBAR_ICON_INDEX.SHAPE},
      {iconState: '', iconSrc: './../../bucket_icon.svg', associatedIndex: SIDEBAR_ICON_INDEX.COLOR},
      {iconState: '', iconSrc: './../../grid_icon.svg', associatedIndex: SIDEBAR_ICON_INDEX.GRID }],

      [{ iconState: ' activeBttn', iconSrc: '../../../assets/pencil_icon.svg', associatedIndex: TOOLS_INDEX.PENCIL },
      { iconState: '', iconSrc: '../../../assets/brush_icon.png', associatedIndex: TOOLS_INDEX.BRUSH },
      { iconState: '', iconSrc: './../../../../../assets/spray.png', associatedIndex: TOOLS_INDEX.SPRAY },
      { iconState: '', iconSrc: '../../../assets/eraser_icon.svg', associatedIndex: TOOLS_INDEX.ERASER }],

      [{ iconState: ' activeBttn', iconSrc: '../../../assets/line_icon.svg', associatedIndex: TOOLS_INDEX.LINE },
      { iconState: '', iconSrc: '../../../assets/shape_icon.svg', associatedIndex: TOOLS_INDEX.RECTANGLE },
      { iconState: '', iconSrc: '../../../assets/oval.svg', associatedIndex: TOOLS_INDEX.ELLIPSE},
      { iconState: '', iconSrc: '../../../assets/hexagon_icon.svg', associatedIndex: TOOLS_INDEX.POLYGON}],

      [{iconState: ' activeBttn', iconSrc: '../../../bucket_icon.svg', associatedIndex: TOOLS_INDEX.BUCKET},
      {iconState: '', iconSrc: '../../../pipette.svg', associatedIndex: TOOLS_INDEX.PICKER},
      {iconState: '', iconSrc: '../../../colorApplicator_icon.svg', associatedIndex: TOOLS_INDEX.APPLICATOR }]
     ];
  }

  preventDefault(e: Event): void {
    e.preventDefault();
  }

  selectedSidebarIconFct(place: number): void {
    this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection();
    if (this.index[SELECTION_MENU_INDEX.SIDEBAR_INDEX] !== place) {
      this.iconsStates[ICON_STATE_INDEX.SIDEBAR_STATE][this.index[SELECTION_MENU_INDEX.SIDEBAR_INDEX]].iconState = '';
      this.iconsStates[ICON_STATE_INDEX.SIDEBAR_STATE][place].iconState = ' active';
      this.index[SELECTION_MENU_INDEX.SIDEBAR_INDEX] = place;
    }
    window.removeEventListener('DOMMouseScroll', this.preventDefault);
    window.removeEventListener('wheel', this.preventDefault);
    switch (place) {
      case SIDEBAR_ICON_INDEX.SELECTION:
        window.addEventListener('DOMMouseScroll', this.preventDefault, false);
        window.addEventListener('wheel', this.preventDefault, { passive: false });
        this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].changeActiveTool(TOOLS_INDEX.SELECTION);
        break;
      case SIDEBAR_ICON_INDEX.DRAWING: {
        this.selectedMenuIconFct(this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX], SIDEBAR_ICON_INDEX.DRAWING);
        break;
      }
      case SIDEBAR_ICON_INDEX.SHAPE: {
        this.selectedMenuIconFct(this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX], SIDEBAR_ICON_INDEX.SHAPE);
        break;
      }
      case SIDEBAR_ICON_INDEX.COLOR: {
        this.selectedMenuIconFct(this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.COLORTOOL_INDEX], SIDEBAR_ICON_INDEX.COLOR);
        break;
      }
      case SIDEBAR_ICON_INDEX.GRID: {
        this.index[SELECTION_MENU_INDEX.ACTIVETOOL_INDEX] = TOOLS_INDEX.GRID;
        this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].changeActiveTool(TOOLS_INDEX.GRID);
        break;
      }
    }
  }

  selectedMenuIconFct(place: number , menu: number): void {
    this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection();
    for (const drawState of this.iconsStates[menu]) {
      drawState.iconState = '';
    }
    this.iconsStates[menu][place].iconState = ' activeBttn';
    this.lastSelectedTool[(menu - 1)] = place;
    this.iconsStates[ICON_STATE_INDEX.SIDEBAR_STATE][menu].iconSrc =
    this.iconsStates[menu][place].iconSrc;
    this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].
    changeActiveTool(this.iconsStates[menu][place].associatedIndex);

    this.index[SELECTION_MENU_INDEX.ACTIVETOOL_INDEX] = this.iconsStates[menu][place].associatedIndex;
    this.lastSelectedTool[(menu - 1)] = place;
  }

  toolSelectionSwitchCase(event: KeyboardEvent): boolean {
    switch (event.key) {
      case 'l':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX] = SHAPE_ICON_INDEX.LINE;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.SHAPE);
        return true;
      case 'c':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX] = DRAWING_ICON_INDEX.PENCIL;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.DRAWING);
        return true;
      case 'e':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX] = DRAWING_ICON_INDEX.ERASER;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.DRAWING);
        return true;
      case 'r':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.COLORTOOL_INDEX] = COLOR_ICON_INDEX.APPLICATOR;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.COLOR);
        return true;
      case 'w':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX] = DRAWING_ICON_INDEX.BRUSH;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.DRAWING);
        return true;
      case '1':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX] = SHAPE_ICON_INDEX.RECTANGLE;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.SHAPE);
        return true;
      case '2':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX] = SHAPE_ICON_INDEX.ELLIPSE;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.SHAPE);
        return true;
      case '3':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX] = SHAPE_ICON_INDEX.POLYGON;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.SHAPE);
        return true;
      case 's':
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.SELECTION);
        return true;
      case 'i':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.COLORTOOL_INDEX] = COLOR_ICON_INDEX.PICKER;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.COLOR);
        return true;
      case 'a':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX] = DRAWING_ICON_INDEX.SPRAY;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.DRAWING);
        return true;
      case 'b':
        this.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.COLORTOOL_INDEX] = COLOR_ICON_INDEX.BUCKET;
        this.selectedSidebarIconFct(SIDEBAR_ICON_INDEX.COLOR);
        return true;
      default:
        return false;
    }
  }

  ctrlSwitchCase(event: KeyboardEvent): boolean {
    if (event.ctrlKey) {
      if (event.shiftKey) {
        if (event.key === 'Z') {
          this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection();
          this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWINVOKERSERVICE].redo();
          event.preventDefault();
          return true;
        }
      }

      if (event.key === 'z') {
        this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection();
        this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWINVOKERSERVICE].undo();
        event.preventDefault();
        return true;
      }

      const selectionKeys = (event.key === 'c' || event.key === 'd' || event.key === 'v' || event.key === 'a');

      if (selectionKeys &&
        (this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].activeTool.activeToolIndex === TOOLS_INDEX.SELECTION)) {
        this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].onCtrlKey(event);
        return true;
      }
    }
    return false;
  }

  modalSwitchCase(event: KeyboardEvent): boolean {
    if (event.ctrlKey && event.key === 'o') {
      this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection();
      this.createNewDrawing(true);
      event.preventDefault();
      return true;
    }
    if (event.ctrlKey && event.key === 'e') {
      this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection();
      this.exportDrawing(true);
      event.preventDefault();
      return true;
    }
    if (event.ctrlKey && event.key === 's') {
      this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection();
      event.preventDefault();
      this.getViewPortPosition();
      this.modalesInstances[MODALES_INSTANCES_INDEX.SHOWSAVEDRAW_INDEX] = true;
      return true;
    }
    if (event.ctrlKey && event.key === 'g') {
      this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection();
      event.preventDefault();
      this.getViewPortPosition();
      this.modalesInstances[MODALES_INSTANCES_INDEX.SHOWGALLERY_INDEX] = true;
      return true;
    }
    return false;
  }

  drawingSpaceToolsSwitchCase(event: KeyboardEvent): boolean {
    switch (event.key) {
      case 'Alt':
        if (this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].activeTool.activeToolIndex === TOOLS_INDEX.SELECTION) {
          this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].isAltDown = true;
          return true;
        }
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowDown':
        this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].arrowKeyDown(event);
        event.preventDefault();
        return false;
      case 'g':
        this.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE].activateGrid();
        this.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE].showGrid();
        return true;
      case '+':
        this.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE].increaseSize();
        return true;
      case '-':
        this.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE].decreaseSize();
        return true;
      default:
        return false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {
    if (this.modalesInstances[MODALES_INSTANCES_INDEX.ATTRIBUTEFOCUS_INDEX]) {
      return true;
    }
    if (this.modalesInstances[MODALES_INSTANCES_INDEX.SHOWSAVEDRAW_INDEX] ||
      this.modalesInstances[MODALES_INSTANCES_INDEX.SHOWCREATEDRAW_INDEX] ||
      this.modalesInstances[MODALES_INSTANCES_INDEX.SHOWEXPORTDRAW_INDEX] ||
      this.modalesInstances[MODALES_INSTANCES_INDEX.SHOWGALLERY_INDEX]) {
      return true;
    }
    if (event.key === 'Delete' &&
      this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].activeTool.activeToolIndex === TOOLS_INDEX.SELECTION) {
      this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].clipBoard.delete();
      return false;
    }
    if (this.modalSwitchCase(event)) { return false; }
    if (this.ctrlSwitchCase(event)) { return false; }
    if (this.toolSelectionSwitchCase(event)) { return false; }
    if (this.drawingSpaceToolsSwitchCase(event)) { return false; }
    this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].onKeyDown(event);
    return true;
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Alt':
        if (this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].activeTool.activeToolIndex === TOOLS_INDEX.SELECTION) {
          this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].isAltDown = false;
          break;
        }
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowDown':
        this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].arrowKeyUp(event);
        break;

      default:
        break;
    }

    this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].onKeyUp(event);
  }

  @HostListener('document:wheel', ['$event'])
  onWheel(event: WheelEvent): [string, string] {
    if (this.externalServices[SERVICE.DRAWBOARD].activeTool.activeToolIndex === TOOLS_INDEX.SELECTION) {
      return this.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].onWheel(event);
    }
    return ['', ''];
  }

  getViewPortPosition(): void {
    const element = this.elementRef.nativeElement.querySelector('#content');
    this.position[0] = element.getBoundingClientRect().top;
    this.position[1] = element.getBoundingClientRect().left;
  }

  createNewDrawing(isCreating: boolean): void {
    this.modalesInstances[MODALES_INSTANCES_INDEX.SHOWCREATEDRAW_INDEX] = isCreating;
    this.getViewPortPosition();
  }

  exportDrawing(isCreating: boolean): void {
    this.getViewPortPosition();
    this.modalesInstances[MODALES_INSTANCES_INDEX.SHOWEXPORTDRAW_INDEX] = isCreating;
  }

  createdNewDrawing(): void {
    this.modalesInstances[MODALES_INSTANCES_INDEX.SHOWCREATEDRAW_INDEX] = false;
    this.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].quickLoad();
    this.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE].isActive = false;
  }
}
