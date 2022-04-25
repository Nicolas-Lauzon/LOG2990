/* tslint:disable:no-unused-variable */
/* tslint:disable:no-magic-numbers */
// tslint:disable: no-string-literal

import { TestBed } from '@angular/core/testing';
import { DrawingSpaceComponent } from 'src/app/components/app/main-page/drawing-space/drawing-space.component';
import { DataService } from '../data-service/data.service';
import { TOOLS_INDEX  } from './../../enums';
import { DrawBoardStateService } from './draw-board-state.service';

describe('DrawBoardStateService', () => {
  let service: DrawBoardStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawBoardStateService, DataService],
      declarations: [DrawingSpaceComponent]
    });
  });
  beforeEach(() => {
    service = TestBed.inject(DrawBoardStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('changeActiveTool changing activeTool', () => {
    service.changeActiveTool(0);
    expect(service.activeTool.tool).toBe(service.tools[0]);
    expect(service.activeTool.activeToolIndex).toBe(0);

    service.changeActiveTool(1);
    expect(service.activeTool.tool).toBe(service.tools[1]);
    expect(service.activeTool.activeToolIndex).toBe(1);

    service.changeActiveTool(2);
    expect(service.activeTool.tool).toBe(service.tools[2]);
    expect(service.activeTool.activeToolIndex).toBe(2);

    service.changeActiveTool(3);
    expect(service.activeTool.tool).toBe(service.tools[3]);
    expect(service.activeTool.activeToolIndex).toBe(3);

    service.changeActiveTool(4);
    expect(service.activeTool.tool).toBe(service.tools[4]);
    expect(service.activeTool.activeToolIndex).toBe(4);
  });

  it('quickSave, dataService.changeDraw called', () => {
    // tslint:disable-next-line:no-string-literal
    spyOn(service['services'].dataService, 'changeDraw');

    const testRect = document.createElement('rect');
    testRect.id = 'rect0';
    testRect.setAttribute('x', '45');
    testRect.setAttribute('y', '300');
    testRect.setAttribute('width', '10');
    testRect.setAttribute('height', '10');
    service.drawboard = testRect;
    service.quickSave();
    expect(service['services'].dataService.changeDraw).toHaveBeenCalled();
  });

  it('quickLoad, drawingService.drawZone = drawzone', () => {
    service.quickLoad();
    expect(service.drawboard).toBe(null);

    // tslint:disable-next-line:no-any
    spyOn<any>(service['services'], 'drawingService');

    const testRect = document.createElement('rect');
    testRect.id = 'rect0';
    testRect.setAttribute('x', '45');
    testRect.setAttribute('y', '300');
    testRect.setAttribute('width', '10');
    testRect.setAttribute('height', '10');
    service.drawboard = testRect;
    service.quickLoad();
    // tslint:disable-next-line:no-string-literal
    expect(service['services'].drawingService.drawZone).toEqual(document.getElementById('drawZone'));

  });

  it('onMouseDown check if replaceTag is called', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const htmlElement: HTMLElement = compiled.querySelector('#drawZone') as HTMLElement;
    service.drawZone = htmlElement.parentElement as HTMLElement;
    const click: MouseEvent = new MouseEvent('mousedown', { clientX: 1, clientY: 1 , button: 0});
    const movement: MouseEvent = new MouseEvent('mousemovement', { clientX: 1, clientY: 1 });
    service.onMouseMovement(movement);
    service.lastMouseMovementEvent = [click, movement];
    spyOn(service, 'replaceTag');
    service.changeActiveTool(1);
    service.onMouseDown(click);
    expect(service.replaceTag).toHaveBeenCalled();

    service.activeTool.tool = undefined;
    service.onMouseDown(click);
    expect(expect(service.replaceTag).toHaveBeenCalled()).toBeFalsy();
  });

  it('onMouseUp check if replaceTag is called', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const htmlElement = compiled.querySelector('#drawZone');
    service.drawZone = htmlElement;
    const click: MouseEvent = new MouseEvent('mouseUp', { clientX: 1, clientY: 1 });
    const movement: MouseEvent = new MouseEvent('mousemovement', { clientX: 1, clientY: 1 });
    service.onMouseMovement(movement);
    service.lastMouseMovementEvent = [click, movement];
    spyOn(service, 'replaceTag');
    service.changeActiveTool(0);
    service.onMouseUp(click);
    expect(service.replaceTag).toHaveBeenCalledTimes(1);
    service.activeTool.tool = service.tools[1];
    service.onMouseUp(click);
    expect(service.replaceTag).toHaveBeenCalled();

    service.activeTool.tool = undefined;
    service.onMouseUp(click);
    expect(expect(service.replaceTag).toHaveBeenCalled()).toBeFalsy();
  });

  it('onMouseOut check if replaceTag is called', () => {
    spyOn(service, 'replaceTag').and.callThrough();

    const click: MouseEvent = new MouseEvent('mouseout', { clientX: 1, clientY: 1 });
    service.onMouseOut(click);
    expect(service.replaceTag).toHaveBeenCalled();
    service.activeTool.tool = undefined;
    service.onMouseOut(click);
    expect(expect(service.replaceTag).toHaveBeenCalled()).toBeFalsy();
  });

  it('onMouseMovement check if replaceTag is called and if lastMovementEvent is changed', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const htmlElement = compiled.querySelector('#drawZone');
    service.drawZone = htmlElement;
    const click: MouseEvent = new MouseEvent('mouseUp', { clientX: 1, clientY: 1 });
    const movement: MouseEvent = new MouseEvent('mousemovement', { clientX: 1, clientY: 1 });

    spyOn(service, 'replaceTag');
    service.changeActiveTool(0);
    service.onMouseMovement(movement);
    expect(service.lastMouseMovementEvent[0]).toEqual(movement);
    expect(service.replaceTag).toHaveBeenCalledTimes(1);

    service.activeTool.tool = service.tools[1];
    service.onMouseMovement(click);
    expect(service.lastMouseMovementEvent[0]).toEqual(click);
    expect(service.replaceTag).toHaveBeenCalled();
    service.activeTool.tool = undefined;
    service.onMouseMovement(click);
    expect(expect(service.replaceTag).toHaveBeenCalled()).toBeFalsy();
  });

  it('onKeyDown and event.ctrlKey true, return', () => {
    const ctrlA: KeyboardEvent = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
    const result = service.onKeyDown(ctrlA);
    expect(result).toEqual();
  });

  it('onKeyDown check if functions have been called ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const htmlElement = compiled.querySelector('#drawZone');
    service.drawZone = htmlElement;
    const click: MouseEvent = new MouseEvent('mousedown', { clientX: 1, clientY: 1 });
    const movement: MouseEvent = new MouseEvent('mousemovement', { clientX: 1, clientY: 1 });
    service.lastMouseMovementEvent = [click, movement];
    const lKey = new KeyboardEvent('keypress', { key: 'l' });
    const cKey = new KeyboardEvent('keypress', { key: 'c' });
    const eKey = new KeyboardEvent('keypress', { key: 'e' });
    const iKey = new KeyboardEvent('keypress', { key: 'i' });
    const wKey = new KeyboardEvent('keypress', { key: 'w' });
    const key1 = new KeyboardEvent('keypress', { key: '1' });
    const key2 = new KeyboardEvent('keypress', { key: '2' });
    const key3 = new KeyboardEvent('keypress', { key: '3' });
    const aKey = new KeyboardEvent('keypress', { key: 'a' });
    const backSpaceKey = new KeyboardEvent('keypress', { key: 'Backspace' });
    const escapeKey = new KeyboardEvent('keypress', { key: 'Escape' });
    const shiftKey = new KeyboardEvent('keypress', { key: 'Shift' });
    const randomKey = new KeyboardEvent('keypress', { key: 'random' });

    service.onKeyDown(lKey);
    expect(service.activeTool.tool).toBe(service.tools[TOOLS_INDEX.LINE]);

    service.onKeyDown(eKey);
    expect(service.activeTool.tool).toBe(service.tools[TOOLS_INDEX.ERASER]);

    service.onKeyDown(key3);
    expect(service.activeTool.tool).toBe(service.tools[TOOLS_INDEX.POLYGON]);

    service.onKeyDown(iKey);
    expect(service.activeTool.tool).toBe(service.tools[TOOLS_INDEX.PICKER]);

    service.onKeyDown(aKey);
    expect(service.activeTool.tool).toBe(service.tools[TOOLS_INDEX.SPRAY]);

    service.onKeyDown(key1);
    expect(service.activeTool.tool).toBe(service.tools[TOOLS_INDEX.RECTANGLE]);

    service.onKeyDown(cKey);
    expect(service.activeTool.tool).toBe(service.tools[TOOLS_INDEX.PENCIL]);

    service.onKeyDown(wKey);
    expect(service.activeTool.tool).toBe(service.tools[TOOLS_INDEX.BRUSH]);

    service.onKeyDown(key2);
    expect(service.activeTool.tool).toBe(service.tools[TOOLS_INDEX.ELLIPSE]);

    spyOn(service, 'replaceTag');
    service.changeActiveTool(0);
    service.onKeyDown(backSpaceKey);
    expect(service.replaceTag).toHaveBeenCalledTimes(1);
    service.activeTool.tool = service.tools[1];
    service.onKeyDown(backSpaceKey);
    expect(service.replaceTag).toHaveBeenCalled();

    service.changeActiveTool(0);
    service.onKeyDown(escapeKey);
    expect(service.replaceTag).toHaveBeenCalledTimes(3);
    service.activeTool.tool = service.tools[1];
    service.onKeyDown(escapeKey);
    expect(service.replaceTag).toHaveBeenCalled();

    service.changeActiveTool(0);
    service.onKeyDown(shiftKey);
    expect(service.replaceTag).toHaveBeenCalledTimes(5);
    service.activeTool.tool = service.tools[1];
    service.onKeyDown(shiftKey);
    expect(service.replaceTag).toHaveBeenCalled();

    service.onKeyDown(randomKey);
    expect(service.replaceTag).toHaveBeenCalledTimes(6);

    service.activeTool.tool = undefined;
    service.onKeyDown(backSpaceKey);
    service.onKeyDown(escapeKey);
    service.onKeyDown(shiftKey);
    expect(expect(service.replaceTag).toHaveBeenCalled()).toBeFalsy();
  });

  it('onKeyDown (Shift and random) check if functions have been called ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const htmlElement = compiled.querySelector('#drawZone');
    service.drawZone = htmlElement;
    const click: MouseEvent = new MouseEvent('mousedown', { clientX: 1, clientY: 1 });
    const movement: MouseEvent = new MouseEvent('mousemovement', { clientX: 1, clientY: 1 });
    service.lastMouseMovementEvent = [click, movement];
    const shiftKey = new KeyboardEvent('keypress', { key: 'Shift' });
    const randomKey = new KeyboardEvent('keypress', { key: 'random' });

    spyOn(service, 'replaceTag');
    service.changeActiveTool(0);
    service.onKeyUp(shiftKey);
    expect(service.replaceTag).toHaveBeenCalledTimes(1);
    service.activeTool.tool = service.tools[1];
    service.onKeyUp(shiftKey);
    expect(service.replaceTag).toHaveBeenCalledTimes(2);

    service.onKeyUp(randomKey);
    expect(service.replaceTag).toHaveBeenCalledTimes(2);

    service.activeTool.tool = undefined;
    service.onKeyUp(shiftKey);
    expect(expect(service.replaceTag).toHaveBeenCalled()).toBeFalsy();
  });

  it('replaceTage check if functions have been called ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const htmlElement = compiled.querySelector('#drawZone');
    service.drawZone = htmlElement;

    const tempId = 'I1';
    const tempContent1 = '<firstinsert id="I1" />';
    const tempContent2 = 'replaceFirstInsert';
    service.replaceTag([tempId, tempContent1]);
    expect((service.drawZone as HTMLElement).innerHTML).toBe('<firstinsert id="I1"></firstinsert>');
    service.replaceTag(['I1', tempContent2]);
    expect((service.drawZone as HTMLElement).innerHTML).toBe('replaceFirstInsert');
    // outside of the first if (no id).
    service.replaceTag(['', tempContent2]);

  });

});
