/* tslint:disable:no-unused-variable */
/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:max-file-line-count */
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatExpansionModule, MatFormFieldModule, MatIconModule, MatListModule, MatMenuModule,
  MatSelectModule, MatSidenavModule, MatSliderModule, MatToolbarModule
} from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrService } from 'ngx-toastr';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { EXTERNAL_SERVICES_INDEX, LAST_SELECTED_TOOL_INDEX, MODALES_INSTANCES_INDEX, TOOLS_INDEX } from 'src/app/enums';
import { DataService } from 'src/app/services/data-service/data.service';
import { DrawBoardStateService } from 'src/app/services/draw-board-state/draw-board-state.service';
import { ColorPaletComponent } from '../color-palet/color-palet.component';
import { CreateDrawingComponent } from '../create-drawing/create-drawing.component';
import { ExportComponent } from '../export/export.component';
import { ThumbnailComponent } from '../gallery/thumbnail/thumbnail.component';
import { GlobalGuideComponent } from '../guide/global-guide/global-guide.component';
import { MainNavComponent } from '../guide/main-nav/main-nav.component';
import { AttributesBucketComponent } from '../main-page/selection-menu/attributes/attributes-bucket/attributes-bucket.component';
import { MenuComponent } from '../start-menu/start-menu.component';
import { GalleryComponent } from './../gallery/gallery.component';
import { SaveDrawingComponent } from './../save-drawing/save-drawing.component';
import { DrawingSpaceComponent } from './drawing-space/drawing-space.component';
import { MainPageComponent } from './main-page.component';
import { AttributesBrushComponent } from './selection-menu/attributes/attributes-brush/attributes-brush.component';

import { AttributesEllipseComponent } from './selection-menu/attributes/attributes-ellipse/attributes-ellipse.component';
import { AttributesEraserComponent } from './selection-menu/attributes/attributes-eraser/attributes-eraser.component';
import { AttributesGridComponent } from './selection-menu/attributes/attributes-grid/attributes-grid.component';
import { AttributesLineComponent } from './selection-menu/attributes/attributes-line/attributes-line.component';
import { AttributesPencilComponent } from './selection-menu/attributes/attributes-pencil/attributes-pencil.component';
import { AttributesPolygonComponent } from './selection-menu/attributes/attributes-polygon/attributes-polygon.component';
import { AttributesRectangleComponent } from './selection-menu/attributes/attributes-rectangle/attributes-rectangle.component';
import SpyObj = jasmine.SpyObj;
import { AttributesSprayComponent } from './selection-menu/attributes/attributes-spray/attributes-spray.component';
import { ColorMenuComponent } from './selection-menu/color-menu/color-menu.component';
import { QuickColorComponent } from './selection-menu/color-menu/quick-color/quick-color.component';
import { SelectionMenuComponent } from './selection-menu/selection-menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let stateSpy: SpyObj<DrawBoardStateService>;
  const toastrMock = {
    error: (s: string) => {/* */},
    success: (s: string) => {/* */},
};

  beforeEach(() => {
    stateSpy = jasmine.createSpyObj('DrawBoardStateService', ['quickSave', 'quickLoad', 'onKeyDown', 'onKeyUp', 'changeActiveTool']);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalGuideComponent, MainNavComponent, MenuComponent,
        MainPageComponent, ColorMenuComponent, CreateDrawingComponent,
        MainPageComponent, SidebarComponent, SelectionMenuComponent, AttributesEraserComponent,
        DrawingSpaceComponent, AttributesPencilComponent, AttributesBrushComponent,
        AttributesLineComponent, AttributesRectangleComponent, ColorPaletComponent,
        AttributesBucketComponent,
        QuickColorComponent, AttributesEllipseComponent, QuickColorComponent, AttributesPolygonComponent,
        AttributesSprayComponent, AttributesGridComponent, GalleryComponent, SaveDrawingComponent, ExportComponent,
        ThumbnailComponent],
      imports: [MatIconModule, MatListModule, MatMenuModule,
        MatSidenavModule, AppRoutingModule, FormsModule,
        ReactiveFormsModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatSelectModule, MatToolbarModule, MatExpansionModule],

      providers: [{ provide: DrawBoardStateService, useValue: stateSpy }, DataService, ToastrService, HttpClient, HttpHandler,
      { provide: APP_BASE_HREF, useValue: '/' }, { provide: ToastrService, useValue: toastrMock }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selectedMenuDrawingIconFct changes the active tool', () => {
    component.selectedMenuIconFct(1, 1);
    expect(component.iconsStates[1][1].iconState).toBe(' activeBttn');
    expect(component.iconsStates[0][1].iconSrc).toBe('../../../assets/brush_icon.png');
    expect(component.iconsStates[1][0].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX]).toBe(1);

    component.selectedMenuIconFct(1, 1);
    expect(component.iconsStates[1][1].iconState).toBe(' activeBttn');
    expect(component.iconsStates[0][1].iconSrc).toBe('../../../assets/brush_icon.png');
    expect(component.iconsStates[1][0].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX]).toBe(1);

    component.selectedMenuIconFct(0, 1);
    expect(component.iconsStates[1][0].iconState).toBe(' activeBttn');
    expect(component.iconsStates[0][1].iconSrc).toBe('../../../assets/pencil_icon.svg');
    expect(component.iconsStates[1][1].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX]).toBe(0);
  });

  it('selectedMenuShapeIconFct changes the active tool', () => {
    component.selectedMenuIconFct(1, 2);
    expect(component.iconsStates[2][1].iconState).toBe(' activeBttn');
    expect(component.iconsStates[0][2].iconSrc).toBe('../../../assets/shape_icon.svg');
    expect(component.iconsStates[2][0].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX]).toBe(1);

    component.selectedMenuIconFct(1, 2);
    expect(component.iconsStates[2][1].iconState).toBe(' activeBttn');
    expect(component.iconsStates[0][2].iconSrc).toBe('../../../assets/shape_icon.svg');
    expect(component.iconsStates[2][0].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX]).toBe(1);

    component.selectedMenuIconFct(0, 2);
    expect(component.iconsStates[2][0].iconState).toBe(' activeBttn');
    expect(component.iconsStates[0][2].iconSrc).toBe('../../../assets/line_icon.svg');
    expect(component.iconsStates[2][1].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX]).toBe(0);
  });

  it('selectedSidebarIconFct change sidebar selection', () => {
    component.selectedSidebarIconFct(1);
    expect(component.iconsStates[0][1].iconState).toBe(' active');
    expect(component.iconsStates[0][0].iconState).toBe('');
    expect(component.index[0]).toBe(1);
    expect(component.index[1]).toBe(component.iconsStates[1][0].associatedIndex);

    component.selectedSidebarIconFct(2);
    expect(component.iconsStates[0][2].iconState).toBe(' active');
    expect(component.iconsStates[0][1].iconState).toBe('');
    expect(component.index[0]).toBe(2);
    expect(component.index[1]).toBe(component.iconsStates[2][0].associatedIndex);

    component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX] = 1;
    component.selectedSidebarIconFct(1);
    expect(component.iconsStates[0][1].iconState).toBe(' active');
    expect(component.iconsStates[0][0].iconState).toBe('');
    expect(component.index[0]).toBe(1);
    expect(component.index[1]).toBe(component.iconsStates[1][1].associatedIndex);

    component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX] = 1;
    component.selectedSidebarIconFct(2);
    expect(component.iconsStates[0][2].iconState).toBe(' active');
    expect(component.iconsStates[0][1].iconState).toBe('');
    expect(component.index[0]).toBe(2);

    component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX] = 1;
    component.selectedSidebarIconFct(4);
    expect(component.iconsStates[0][4].iconState).toBe(' active');
    expect(component.iconsStates[0][2].iconState).toBe('');
    expect(component.index[0]).toBe(4);
    expect(component.index[1]).toBe(TOOLS_INDEX.GRID);

    component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX] = 1;
    component.selectedSidebarIconFct(4);
    expect(component.iconsStates[0][4].iconState).toBe(' active');
    expect(component.index[0]).toBe(4);
    expect(component.index[1]).toBe(TOOLS_INDEX.GRID);
  });

  it('selectedSidebarIconFct not going in the if', () => {
    component.index[0] = 1;
    component.selectedSidebarIconFct(1);
    expect(component.iconsStates[0][1].iconState).toEqual(' active');
  });

  it('onKeyDown check if functions have been called ', () => {
    const lKey = new KeyboardEvent('keypress', { key: 'l' });
    const cKey = new KeyboardEvent('keypress', { key: 'c' });
    const wKey = new KeyboardEvent('keypress', { key: 'w' });
    const sKey = new KeyboardEvent('keypress', { key: 's' });
    const keyOne = new KeyboardEvent('keypress', { key: '1' });
    const eKey = new KeyboardEvent('keypress', { key: 'e' });
    const randomKey = new KeyboardEvent('keypress', { key: 'r' });
    const ctrlAKey = new KeyboardEvent('keypress', { ctrlKey: true, key: 'a' });
    const deleteKey = new KeyboardEvent('keypress', { key: 'Delete' });

    component.onKeyDown(lKey);
    expect(component.iconsStates[0][2].iconState).toBe(' active');
    expect(component.iconsStates[0][2].iconSrc).toBe('../../../assets/line_icon.svg');
    expect(component.iconsStates[0][1].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX]).toBe(0);

    component.onKeyDown(keyOne);
    expect(component.iconsStates[0][2].iconState).toBe(' active');
    expect(component.iconsStates[0][2].iconSrc).toBe('../../../assets/shape_icon.svg');
    expect(component.iconsStates[0][1].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.SHAPETOOL_INDEX]).toBe(1);

    component.onKeyDown(cKey);
    expect(component.iconsStates[0][1].iconState).toBe(' active');
    expect(component.iconsStates[0][1].iconSrc).toBe('../../../assets/pencil_icon.svg');
    expect(component.iconsStates[0][2].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX]).toBe(0);

    component.onKeyDown(eKey);
    expect(component.iconsStates[0][1].iconState).toBe(' active');
    expect(component.iconsStates[0][1].iconSrc).toBe('../../../assets/eraser_icon.svg');
    expect(component.iconsStates[0][2].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX]).toBe(3);

    component.onKeyDown(wKey);
    expect(component.iconsStates[0][1].iconState).toBe(' active');
    expect(component.iconsStates[0][1].iconSrc).toBe('../../../assets/brush_icon.png');
    expect(component.iconsStates[0][2].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX]).toBe(1);

    component.onKeyDown(randomKey);
    expect(component.iconsStates[0][1].iconSrc).toBe('../../../assets/brush_icon.png');
    expect(component.iconsStates[0][2].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX]).toBe(1);

    component.onKeyDown(sKey);
    expect(component.iconsStates[0][0].iconState).toBe(' active');
    expect(component.iconsStates[0][1].iconState).toBe('');
    expect(component.iconsStates[0][2].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX]).toBe(1);
    component.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].activeTool = {tool: undefined , activeToolIndex: 1};
    component.externalServices[EXTERNAL_SERVICES_INDEX.DRAWBOARDSERVICE].activeTool.activeToolIndex = 0;

    component.onKeyDown(ctrlAKey);
    expect(component.iconsStates[0][0].iconState).toBe(' active');
    expect(component.iconsStates[0][1].iconState).toBe('');
    expect(component.iconsStates[0][2].iconState).toBe('');
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX]).toBe(1);

    component.onKeyDown(deleteKey);
    expect(component.lastSelectedTool[LAST_SELECTED_TOOL_INDEX.DRAWINGTOOL_INDEX]).toBe(1);
  });

  it('onKeyDown and attributeFocus, return', () => {
    component.modalesInstances[MODALES_INSTANCES_INDEX.ATTRIBUTEFOCUS_INDEX] = true;
    const lKey = new KeyboardEvent('keypress', { key: 'l' });
    const result = component.onKeyDown(lKey);
    expect(result).toEqual(true);
  });

  it('onKeyDown and showSaveDraw, return', () => {
    component.modalesInstances[MODALES_INSTANCES_INDEX.SHOWSAVEDRAW_INDEX] = true;
    const lKey = new KeyboardEvent('keypress', { key: 'l' });
    const result = component.onKeyDown(lKey);
    expect(result).toEqual(true);
  });
  it('onKeyDown and showCreateDraw, return', () => {
    component.modalesInstances[MODALES_INSTANCES_INDEX.SHOWCREATEDRAW_INDEX] = true;
    const lKey = new KeyboardEvent('keypress', { key: 'l' });
    const result = component.onKeyDown(lKey);
    expect(result).toEqual(true);
  });
  it('onKeyDown and showExportDraw, return', () => {
    component.modalesInstances[MODALES_INSTANCES_INDEX.SHOWEXPORTDRAW_INDEX] = true;
    const lKey = new KeyboardEvent('keypress', { key: 'l' });
    const result = component.onKeyDown(lKey);
    expect(result).toEqual(true);
  });
  it('createNewDrawing should quickSave and change the active create draw ', () => {
    const spy = spyOn(component, 'getViewPortPosition' as never);
    component.createNewDrawing(true);
    expect(spy).toHaveBeenCalled();
  });

  it('createNewDrawing and isCreating false, data.changeActiveSavingDraw(false) called ', () => {
    const spy = spyOn(component, 'getViewPortPosition' as never);
    component.createNewDrawing(false);
    expect(spy).toHaveBeenCalled();
  });

  it('onKeyUp should call onKeyUp from service ', () => {
    const event = new KeyboardEvent('keyup', { key: 'a' });
    component.onKeyUp(event);
    expect(stateSpy.onKeyUp).toHaveBeenCalled();
  });

  it('onKeyDown "a" should work properly ', () => {
    const spy = spyOn(component, 'selectedSidebarIconFct');
    const event = new KeyboardEvent('keydown', { key: 'a' });
    component.onKeyDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('onKeyDown "i" should work properly ', () => {
    const spy = spyOn(component, 'selectedSidebarIconFct');
    const event = new KeyboardEvent('keydown', { key: 'i' });
    component.onKeyDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('Selection rotation related fonctions should work properly ', () => {
    const spy = spyOn(component.externalServices[3], 'onWheel');
    component.externalServices[0].activeTool = {tool: undefined, activeToolIndex: 1};
    const wheelEvent = new WheelEvent('keydown', { deltaY: 15 });
    component.onWheel(wheelEvent);
    component.externalServices[0].activeTool = {tool: undefined, activeToolIndex: 0};
    const event = new KeyboardEvent('keydown', { key: 's' });
    const secondEvent = new KeyboardEvent('keydown', { key: 'Alt' });
    component.onKeyDown(event);
    component.onKeyDown(secondEvent);
    component.onKeyUp(secondEvent);
    component.onWheel(wheelEvent);
    component.preventDefault(wheelEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('onKeyDown "arrow" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX], 'arrowKeyDown');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    component.onKeyDown(event);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].arrowKeyDown).toHaveBeenCalled();

    const event1 = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    component.onKeyDown(event1);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].arrowKeyDown).toHaveBeenCalled();

    const event2 = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    component.onKeyDown(event2);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].arrowKeyDown).toHaveBeenCalled();

    const event3 = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    component.onKeyDown(event3);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].arrowKeyDown).toHaveBeenCalled();
  });

  it('onKeyUp "arrow" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX], 'arrowKeyUp');
    const event = new KeyboardEvent('keyup', { key: 'ArrowDown' });
    component.onKeyUp(event);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].arrowKeyUp).toHaveBeenCalled();

    const event1 = new KeyboardEvent('keyup', { key: 'ArrowRight' });
    component.onKeyUp(event1);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].arrowKeyUp).toHaveBeenCalled();

    const event2 = new KeyboardEvent('keyup', { key: 'ArrowLeft' });
    component.onKeyUp(event2);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].arrowKeyUp).toHaveBeenCalled();

    const event3 = new KeyboardEvent('keyup', { key: 'ArrowUp' });
    component.onKeyUp(event3);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].arrowKeyUp).toHaveBeenCalled();
  });

  it('onKeyDown "g" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE], 'activateGrid');
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE], 'showGrid');
    const event = new KeyboardEvent('keydown', { key: 'g' });
    component.onKeyDown(event);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE].activateGrid).toHaveBeenCalled();
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE].showGrid).toHaveBeenCalled();
  });

  it('onKeyDown "+" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE], 'increaseSize');
    const event = new KeyboardEvent('keydown', { key: '+' });
    component.onKeyDown(event);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE].increaseSize).toHaveBeenCalled();
  });

  it('onKeyDown "-" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE], 'decreaseSize');
    const event = new KeyboardEvent('keydown', { key: '-' });
    component.onKeyDown(event);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.GRIDSERVICE].decreaseSize).toHaveBeenCalled();
  });

  it('onKeyDown "1" should work properly ', () => {
    spyOn(component, 'selectedSidebarIconFct');
    const event2 = new KeyboardEvent('keydown', { key: '1' });
    component.onKeyDown(event2);
    expect(component.selectedSidebarIconFct).toHaveBeenCalled();
  });

  it('onKeyDown "2" should work properly ', () => {
    spyOn(component, 'selectedSidebarIconFct');
    const event2 = new KeyboardEvent('keydown', { key: '2' });
    component.onKeyDown(event2);
    expect(component.selectedSidebarIconFct).toHaveBeenCalled();
  });

  it('onKeyDown "3" should work properly ', () => {
    spyOn(component, 'selectedSidebarIconFct');
    const event2 = new KeyboardEvent('keydown', { key: '3' });
    component.onKeyDown(event2);
    expect(component.selectedSidebarIconFct).toHaveBeenCalled();
  });

  it('onKeyDown "l" should work properly ', () => {
    spyOn(component, 'selectedSidebarIconFct');
    const event3 = new KeyboardEvent('keydown', { key: 'l' });
    component.onKeyDown(event3);
    expect(component.selectedSidebarIconFct).toHaveBeenCalled();
  });

  it('onKeyDown "c" should work properly ', () => {
    spyOn(component, 'selectedSidebarIconFct');
    const event4 = new KeyboardEvent('keydown', { key: 'c' });
    component.onKeyDown(event4);
    expect(component.selectedSidebarIconFct).toHaveBeenCalled();
  });

  it('onKeyDown "default" should work properly ', () => {
    spyOn(component, 'selectedSidebarIconFct');
    const event4 = new KeyboardEvent('keydown', { key: '' });
    const result = component.onKeyDown(event4);
    expect(result).toEqual(true);
  });

  it('onKeyDown "w" should work properly ', () => {
    spyOn(component, 'selectedSidebarIconFct');
    const event5 = new KeyboardEvent('keydown', { key: 'w' });
    component.onKeyDown(event5);
    expect(component.selectedSidebarIconFct).toHaveBeenCalled();
  });

  it('onKeyDown "b" should work properly ', () => {
    spyOn(component, 'selectedSidebarIconFct');
    const event5 = new KeyboardEvent('keydown', { key: 'b' });
    component.onKeyDown(event5);
    expect(component.selectedSidebarIconFct).toHaveBeenCalled();
  });

  it('onKeyDown "ctrl + o" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX], 'resetSelection');
    const event6 = new KeyboardEvent('keydown', { key: 'o', ctrlKey: true });
    component.onKeyDown(event6);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection).toHaveBeenCalled();
  });

  it('onKeyDown "ctrl + e" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX], 'resetSelection');
    const event = new KeyboardEvent('keydown', { key: 'e', ctrlKey: true });
    component.onKeyDown(event);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection).toHaveBeenCalled();
  });

  it('onKeyDown "ctrl + s" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX], 'resetSelection');
    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
    component.onKeyDown(event);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection).toHaveBeenCalled();
  });

  it('onKeyDown "ctrl + g" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX], 'resetSelection');
    const event = new KeyboardEvent('keydown', { key: 'g', ctrlKey: true });
    component.onKeyDown(event);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection).toHaveBeenCalled();
  });

  it('onKeyDown "ctrl + z" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX], 'resetSelection');
    const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
    component.onKeyDown(event);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection).toHaveBeenCalled();
  });

  it('onKeyDown "ctrl + shift + z" should work properly ', () => {
    spyOn(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX], 'resetSelection');
    const event = new KeyboardEvent('keydown', { key: 'Z', ctrlKey: true, shiftKey: true });
    component.onKeyDown(event);
    expect(component.externalServices[EXTERNAL_SERVICES_INDEX.SELECTIONSERVICE_INDEX].resetSelection).toHaveBeenCalled();
  });

  it('Modale should disapear when a new draw is created', () => {
    expect(component.modalesInstances[MODALES_INSTANCES_INDEX.SHOWCREATEDRAW_INDEX]).toBeFalsy();
    component.createdNewDrawing();
    expect(component.modalesInstances[MODALES_INSTANCES_INDEX.SHOWCREATEDRAW_INDEX]).toBeFalsy();
    expect(stateSpy.quickLoad).toHaveBeenCalled();
  });

});
