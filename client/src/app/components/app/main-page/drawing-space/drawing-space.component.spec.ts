// tslint:disable: no-string-literal

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TOOLS_INDEX } from 'src/app/enums';
import { DataService } from '../../../../services/data-service/data.service';
import { DrawBoardStateService } from '../../../../services/draw-board-state/draw-board-state.service';
import { DrawingService } from './../../../../services/drawing-service/drawing.service';
import { IntervalService } from './../../../../services/interval-service/interval.service';
import { DrawingSpaceComponent } from './drawing-space.component';

describe('Drawing_spaceComponent', () => {
  let component: DrawingSpaceComponent;
  let fixture: ComponentFixture<DrawingSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrawingSpaceComponent],
      providers: [ DrawBoardStateService, DataService, DrawingService, IntervalService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ', () => {
    component['services'].drawBoardStateService.drawboard = null;
    component.ngOnInit();
    component['services'].drawBoardStateService.drawboard = null;
    component.ngAfterContentInit();
    expect(component).toBeTruthy();

  });

  it('#onMouseDown should call onMouseDown of the service', () => {
    const coordonate = new MouseEvent('mousedown');
    const spy = spyOn(component['services'].drawBoardStateService, 'onMouseDown');
    component.onMouseDown(coordonate);
    expect(spy).toHaveBeenCalled();
    component['drawingState'][1] = true ;
    component.onMouseDown(coordonate);
    expect(component['drawingState'][1] = true).toBeTruthy();
  });
  it('#onMouseup should call onMouseUp of the service', () => {
    const coordonate = new MouseEvent('mouseup');
    const spy = spyOn(component['services'].drawBoardStateService, 'onMouseUp');
    component.onMouseUp(coordonate);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseOut, call clearInterval', () => {
    const coordonate = new MouseEvent('mouseout');
    const spy = spyOn(component['services'].drawBoardStateService, 'onMouseOut');

    component.onMouseOut(coordonate);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMovement should call onMouseMovement of the service', () => {
    const coordonate2 = new MouseEvent('mousemove', { clientX: 500, clientY: 554 });
    const coordonate3 = new MouseEvent('mousemove', { clientX: 508, clientY: 550 });
    const spy = spyOn(component['services'].drawBoardStateService, 'onMouseMovement');
    component.onMouseMovement(coordonate2);
    component.onMouseMovement(coordonate3);
    expect(spy).toHaveBeenCalled();
  });

  it('#onMouseMovement and isPainting and intervalStarted', () => {
    component['drawingState'][0] = true;
    component['drawingState'][1] = true;
    const coordonate = new MouseEvent('mousemove', { clientX: 508, clientY: 50 });
    const spy = spyOn(component['services'].drawBoardStateService, 'onMouseMovement');
    component.onMouseMovement(coordonate);
    expect(spy).toHaveBeenCalled();
  });

  it('switchLastCall starts intervaL on mouse down ', () => {
    component['services'].drawBoardStateService.activeTool.activeToolIndex = TOOLS_INDEX.SPRAY ;
    component['services'].drawBoardStateService.changeActiveTool(TOOLS_INDEX.SPRAY);
    expect(component['services'].drawBoardStateService.activeTool.activeToolIndex).toBe(TOOLS_INDEX.SPRAY);
    const coordonate = new MouseEvent('mousemove', { clientX: 508, clientY: 50 });
    component.lastCoord = coordonate;
    // tslint:disable-next-line:no-magic-numbers
    component['services'].intervalService.value = 5000;

    component['drawingState'][1] = false;

    component.switchLastCall();
    expect(component['drawingState'][1]).toBe(true);
    clearInterval(component.timer);
  });

});
