/* tslint:disable:no-unused-variable no-string-literal no-any no-magic-numbers*/
import { TestBed } from '@angular/core/testing';
import { DrawingSpaceComponent } from 'src/app/components/app/main-page/drawing-space/drawing-space.component';
import { DataService } from '../../data-service/data.service';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawingService } from '../../drawing-service/drawing.service';
import { Box } from '../box';
import { DrawStrategySelectionService } from './draw-strategy-selection.service';

describe('Service: DrawStrategySelection', () => {
  let service: DrawStrategySelectionService;
  let selectedZone: HTMLElement;
  let drawZone: HTMLElement;
  let svg: HTMLElement;
  let testRect: SVGRectElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawStrategySelectionService, DrawInvokerService, DrawingService, DataService],
      declarations: [DrawingSpaceComponent]
    });
  });
  beforeEach(() => {
    service = TestBed.inject(DrawStrategySelectionService);

    testRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    testRect.id = 'rect0';
    testRect.setAttribute('x', '45');
    testRect.setAttribute('y', '300');
    testRect.setAttribute('width', '10');
    testRect.setAttribute('height', '10');

    drawZone = document.createElement('g');
    drawZone.id = 'drawZone';
    drawZone.setAttribute('x', '0');
    drawZone.setAttribute('y', '0');
    drawZone.setAttribute('width', '1000');
    drawZone.setAttribute('height', '1000');
    document.body.appendChild(testRect);

    selectedZone = document.createElement('g');
    selectedZone.id = 'selectedZone';

    svg = document.createElement('svg');
    svg.id = 'svg';
    svg.setAttribute('width', '1000');
    svg.setAttribute('height', '1000');
    svg.appendChild(drawZone);
    svg.appendChild(selectedZone);
    document.body.appendChild(svg);

    const element = document.body.querySelector('#svg') as HTMLElement;
    element.outerHTML = '<svg id="svg" version="1.1" baseProfile="full"' +
      '[attr.width]="dimensionsX" [attr.height]="dimensionsY"' +
      'xmlns="http://www.w3.org/2000/svg" (mousedown)="onMouseDown($event)"' +
      '(mousemove)="onMouseMovement($event)" (mouseup)="onMouseUp($event)"' +
      '(mouseleave)="onMouseOut($event)"></svg>';

    service['selection']['drawingService'] = new DrawingService();
    service['selection']['drawingService'].selectedZone = selectedZone;
    service['selection']['drawingService'].drawZone = drawZone;
    service['selection']['drawingService'].svg = document.body.querySelector('#svg');
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('getSelectionStatus returns true if targets[0] not null', () => {

    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const rect = document.createElement('g');
    rect.id = 'rect1';
    const rec = document.createElement('rect');
    rec.setAttribute('x', '5');
    rec.setAttribute('y', '5');
    rec.setAttribute('width', '5');
    rec.setAttribute('height', '5');
    rect.appendChild(rec);
    drawZone.appendChild(rect);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(rect);
    service['selection'].updateSelectedZone();

    const result = service.getSelectionStatus();
    expect(result).toBeTruthy();
  });

  it('On single left click', async () => {

    spyOn<any>(service['selection'], 'initialiseSelection').and.callThrough();
    spyOn<any>(service['selection'], 'updateSelectedZone').and.callThrough();

    const click: MouseEvent = new MouseEvent('mousedown', { button: 0, clientX: 50, clientY: 50 });
    testRect.dispatchEvent(click);
    service['selection'].targets[0].set('rect1', testRect);
    service.onMouseDown(click, click['button']);
    expect(service['selection']['initialiseSelection']).toHaveBeenCalled();
    expect(service['selection']['isSelecting']).toBeTruthy();
    expect(service['selection']['button']).toBe(0);
    expect(service['selection'].updateSelectedZone).toHaveBeenCalled();
  });

  it('On drag with right click', () => {
    service['selection']['selectionBox'].topLeft = [0, 0];
    service['selection']['selectionBox'].bottomRight = [0, 0];

    const click: MouseEvent = new MouseEvent('mousedown', { button: 0, clientX: 300, clientY: 300 });
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 360, clientY: 360 });
    testRect.dispatchEvent(click);
    service.onMouseDown(click, click['button']);
    testRect.dispatchEvent(move);
    service.onMouseMovement(move);

    expect(service['selection']['selectionBox'].dimensions).toEqual([60, 60]);
  });

  it('On mousemove with no click', () => {
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 60, clientY: 60 });

    const result = service.onMouseMovement(move);

    expect(service['selection']['selectionBox'].topLeft).toEqual([0, 0]);
    expect(service['selection']['selectionBox'].bottomRight).toEqual([0, 0]);
    expect(result).toEqual(['selection', '']);
  });

  it('onMouseOut do nothing', () => {
    const click: MouseEvent = new MouseEvent('mouseout', { button: 0, clientX: 50, clientY: 50 });
    const result = service.onMouseOut(click);
    expect(result).toEqual(['', '']);
  });

  it('onCtrlKey a call updateSelectedZone', () => {
    spyOn<any>(service['selection'], 'updateSelectedZone').and.callThrough();
    const ctrlA: KeyboardEvent = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
    const result = service.onCtrlKey(ctrlA);
    expect(result).toEqual(['', '']);
    expect(service['selection'].updateSelectedZone).toHaveBeenCalled();
  });

  it('onCtrlKey c call clipboard.copy', () => {
    spyOn<any>(service.clipBoard, 'copy');
    const ctrlC: KeyboardEvent = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true });
    service.onCtrlKey(ctrlC);
    expect(service.clipBoard.copy).toHaveBeenCalled();
  });

  it('onCtrlKey v call clipboard.paste', () => {
    spyOn<any>(service.clipBoard, 'paste');
    const ctrlV: KeyboardEvent = new KeyboardEvent('keydown', { key: 'v', ctrlKey: true });
    service.onCtrlKey(ctrlV);
    expect(service.clipBoard.paste).toHaveBeenCalled();
  });

  it('onCtrlKey x call clipboard.cut', () => {
    spyOn<any>(service.clipBoard, 'cut');
    const ctrlX: KeyboardEvent = new KeyboardEvent('keydown', { key: 'x', ctrlKey: true });
    service.onCtrlKey(ctrlX);
    expect(service.clipBoard.cut).toHaveBeenCalled();
  });

  it('onCtrlKey d call clipboard.duplicate', () => {
    spyOn<any>(service.clipBoard, 'duplicate');
    const ctrlD: KeyboardEvent = new KeyboardEvent('keydown', { key: 'd', ctrlKey: true });
    service.onCtrlKey(ctrlD);
    expect(service.clipBoard.duplicate).toHaveBeenCalled();
  });

  it('onCtrlKey nothing call nothing', () => {
    const ctrlD: KeyboardEvent = new KeyboardEvent('keydown', { ctrlKey: true });
    const result = service.onCtrlKey(ctrlD);
    expect(result).toEqual(['', '']);
  });

  it('onShift up and down do nothing', () => {
    spyOn<any>(service['selection'], 'updateSelectedZone').and.callThrough();
    const shiftADown: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50, shiftKey: true });
    const shiftAUp: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50, shiftKey: false });
    let result = service.onShiftDown(shiftADown);
    expect(result).toEqual(['', '']);
    result = service.onShiftUp(shiftAUp);
    expect(result).toEqual(['', '']);
  });

  it('onEscape do nothing', () => {
    spyOn<any>(service['selection'], 'updateSelectedZone').and.callThrough();
    const shiftADown: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    const result = service.onEscape(shiftADown);
    expect(result).toEqual(['', '']);
  });

  it('onBackspace do nothing', () => {
    spyOn<any>(service['selection'], 'updateSelectedZone').and.callThrough();
    const shiftADown: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    const result = service.onBackspace(shiftADown);
    expect(result).toEqual(['', '']);
  });

  it('onMouseUp turn off the selection and replaces the targets', () => {
    const click: MouseEvent = new MouseEvent('mousedown', { button: 2, clientX: 50, clientY: 50 });
    const mouseup: MouseEvent = new MouseEvent('mouseup', { button: 2, clientX: 50, clientY: 50 });
    testRect.dispatchEvent(click);
    service.onMouseDown(click, click['button']);
    testRect.dispatchEvent(mouseup);
    service.onMouseUp(mouseup);
    expect(service['selection']['isSelecting']).toEqual(false);
    expect(service['selection'].targets[0]).toEqual(service['selection'].targets[1]);
  });

  it('If resetSelection called, resetSelection is called', () => {
    spyOn<any>(service['selection'], 'resetSelection').and.callThrough();
    service.resetSelection();

    expect(service['selection'].resetSelection).toHaveBeenCalled();
  });

  it('If arrowKeyUp called, transformation.arrowKeyUp called', () => {
    spyOn<any>(service['transformation'], 'arrowKeyUp').and.callThrough();
    const arrowUp: KeyboardEvent = new KeyboardEvent('keydown', { key: 'up arrow' });
    const result = service.arrowKeyUp(arrowUp);
    expect(result).toEqual(['', '']);
    expect(service['transformation'].arrowKeyUp).toHaveBeenCalled();
  });

  it('If arrowKeyDown called, transformation.arrowKeyDown called', () => {
    spyOn<any>(service['transformation'], 'arrowKeyDown').and.callThrough();
    const arrowDown: KeyboardEvent = new KeyboardEvent('keydown', { key: 'down arrow' });
    const result = service.arrowKeyDown(arrowDown);
    expect(result).toEqual(['', '']);
    expect(service['transformation'].arrowKeyDown).toHaveBeenCalled();
  });

  it('If isWithinSelection, onMouseDown return transformation.onMouseDown', () => {
    spyOn<any>(service['transformation'], 'onMouseDown');
    spyOn<any>(service['selection'], 'isWithinSelection').and.returnValue(true);

    const theG = document.createElement('g');
    theG.id = 'rect5';

    const theRect = document.createElement('rect');
    theRect.setAttribute('x', '45');
    theRect.setAttribute('y', '300');
    theRect.setAttribute('width', '5');
    theRect.setAttribute('height', '5');

    theG.setAttribute('x', '45');
    theG.setAttribute('y', '300');
    theG.setAttribute('width', '5');
    theG.setAttribute('height', '5');

    theG.appendChild(theRect);
    document.body.appendChild(theG);
    service['selection'].targets[0].set('rect5', theRect);
    const click: MouseEvent = new MouseEvent('mousedown', { button: 0, clientX: 300, clientY: 300 });
    theRect.dispatchEvent(click);
    service.onMouseDown(click, click['button']);

    expect(service['transformation'].onMouseDown).toHaveBeenCalled();

  });

  it('If isTranforming, onMouseMovement return transformation.onMouseMovement', () => {
    spyOn<any>(service['transformation'], 'onMouseMovement');
    spyOn<any>(service, 'isTransforming').and.returnValue(true);
    const theRect = document.createElement('rect');
    theRect.id = 'rect1';
    theRect.setAttribute('x', '45');
    theRect.setAttribute('y', '300');
    theRect.setAttribute('width', '5');
    theRect.setAttribute('height', '5');
    document.body.appendChild(theRect);
    const click: MouseEvent = new MouseEvent('mousedown', { button: 0, clientX: 300, clientY: 300 });
    theRect.dispatchEvent(click);
    service.onMouseDown(click, click['button']);
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 360, clientY: 360 });
    theRect.dispatchEvent(move);
    service.onMouseMovement(move);

    expect(service['transformation'].onMouseMovement).toHaveBeenCalled();
  });

  it('If isTranforming, onMouseUp return transformation.onMouseUp', () => {
    spyOn<any>(service['transformation'], 'onMouseUp');
    spyOn<any>(service, 'isTransforming').and.returnValue(true);
    const theRect = document.createElement('rect');
    theRect.id = 'rect1';
    theRect.setAttribute('x', '45');
    theRect.setAttribute('y', '300');
    theRect.setAttribute('width', '5');
    theRect.setAttribute('height', '5');
    document.body.appendChild(theRect);
    const click: MouseEvent = new MouseEvent('mousedown', { button: 0, clientX: 300, clientY: 300 });
    theRect.dispatchEvent(click);
    service.onMouseDown(click, click['button']);
    const up: MouseEvent = new MouseEvent('mouseup', { button: 0, clientX: 300, clientY: 300 });
    theRect.dispatchEvent(up);
    service.onMouseUp(up);

    expect(service['transformation'].onMouseUp).toHaveBeenCalled();
  });

  it('If onMouseDown of transformation, addTarget, selection.updateSelectedZone and memoriseHtmls called', () => {
    spyOn<any>(service['transformation'], 'onMouseDown').and.callThrough();
    spyOn<any>(service['transformation'], 'addTarget');
    spyOn<any>(service['transformation']['selection'], 'updateSelectedZone');
    spyOn<any>(service['transformation'], 'memoriseHtmls');
    const click: MouseEvent = new MouseEvent('mousedown', { button: 0, clientX: 300, clientY: 300 });
    testRect.dispatchEvent(click);
    service['transformation'].onMouseDown(click, click['button']);

    expect(service['transformation']['addTarget']).toHaveBeenCalled();
    expect(service['transformation']['selection'].updateSelectedZone).toHaveBeenCalled();
    expect(service['transformation'].memoriseHtmls).toHaveBeenCalled();
  });

  it('If onMouseUp of transformation, drawInvoker and lastCommand.clear called', () => {
    spyOn<any>(service['transformation'], 'onMouseUp').and.callThrough();
    spyOn<any>(service['transformation']['drawInvoker'], 'do');
    spyOn<any>(service['transformation']['lastCommand'], 'clear');
    const click: MouseEvent = new MouseEvent('mousedown', { button: 0, clientX: 300, clientY: 300 });
    testRect.dispatchEvent(click);
    service['transformation'].onMouseDown(click, click['button']);
    const up: MouseEvent = new MouseEvent('mouseup', { button: 0, clientX: 300, clientY: 300 });
    testRect.dispatchEvent(up);
    service['transformation'].onMouseUp();

    expect(service['transformation']['drawInvoker'].do).toHaveBeenCalled();
    expect(service['transformation']['lastCommand'].clear).toHaveBeenCalled();
  });

  it('If onMouseMovement of transformation, translate and selection.updateSelectedZone called', () => {
    spyOn<any>(service['transformation'], 'onMouseMovement').and.callThrough();
    spyOn<any>(service['transformation'], 'translate');
    spyOn<any>(service['transformation']['selection'], 'updateSelectedZone');
    const click: MouseEvent = new MouseEvent('mousedown', { button: 0, clientX: 300, clientY: 300 });
    testRect.dispatchEvent(click);
    service['transformation'].onMouseDown(click, click['button']);
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 350, clientY: 350 });
    testRect.dispatchEvent(move);
    service['transformation'].onMouseMovement(move);

    expect(service['transformation'].translate).toHaveBeenCalled();
    expect(service['transformation']['selection'].updateSelectedZone).toHaveBeenCalled();
  });

  it('If arrowKeyUp of transformation and arrows.has true, arrows.set called', () => {
    spyOn<any>(service['transformation'], 'arrowKeyUp').and.callThrough();
    spyOn<any>(service['transformation']['arrows'], 'has').and.returnValue(true);
    spyOn<any>(service['transformation']['arrows'], 'set');

    const arrowUp: KeyboardEvent = new KeyboardEvent('keydown', { key: 'up arrow' });
    service['transformation'].arrowKeyUp(arrowUp);

    expect(service['transformation']['arrows'].set).toHaveBeenCalled();
  });

  it('If setArrowPressInterval of transformation called and arrow.set false, clearInterval called', async () => {
    spyOn<any>(service['transformation'], 'setArrowPressInterval').and.callThrough();
    spyOn<any>(service['transformation'], 'keyBoardMove');
    spyOn<any>(service['transformation']['selection'], 'updateSelectedZone');

    service['transformation']['arrows'].set('isContinuous', true);
    service['transformation']['arrows'].set('ArrowUp', true);
    service['transformation']['arrows'].set('ArrowRight', true);
    service['transformation']['arrows'].set('ArrowLeft', true);
    service['transformation']['arrows'].set('ArrowDown', true);

    const arrowDown: KeyboardEvent = new KeyboardEvent('keydown', { key: 'down arrow' });

    service.arrowKeyDown(arrowDown);

    service['transformation']['arrows'].set('isContinuous', true);
    service['transformation'].setArrowPressInterval();

    await new Promise((done) => setTimeout(() => done(), 700));

    expect(service['transformation'].keyBoardMove).toHaveBeenCalled();
    expect(service['transformation']['selection'].updateSelectedZone).toHaveBeenCalled();
  });

  it('If scan of selection called and button is MOUSE_BUTTON.RIGHT, target initialised', () => {
    spyOn<any>(service['selection'], 'scan').and.callThrough();
    service['selection']['button'] = 2;
    service['selection']['scan']();

    const target = new Map<string, Element>();

    expect(service['selection'].targets[0]).toEqual(target);
  });

  it('find within scan', () => {
    let rect1: HTMLElement;
    let rect2: HTMLElement;
    let testRect1: HTMLElement;
    let testRect2: HTMLElement;
    testRect1 = document.createElement('g');
    testRect1.id = 'rect1';
    testRect1.setAttribute('class', 'papa other fill');
    testRect1.setAttribute('x', '45');
    testRect1.setAttribute('y', '100');
    testRect1.setAttribute('width', '30');
    testRect1.setAttribute('height', '30');

    rect1 = document.createElement('rect');
    rect1.setAttribute('class', 'rectangleTest fill');
    rect1.setAttribute('x', '45');
    rect1.setAttribute('y', '100');
    rect1.setAttribute('width', '30');
    rect1.setAttribute('height', '30');
    rect1.setAttribute('fill', 'black');

    rect1.setAttribute('stroke', 'black');

    testRect1.appendChild(rect1);
    testRect2 = document.createElement('g');
    testRect2.id = 'rect2';
    testRect2.setAttribute('class', 'papa contour');
    testRect2.setAttribute('x', '45');
    testRect2.setAttribute('y', '100');
    testRect2.setAttribute('width', '30');
    testRect2.setAttribute('height', '30');

    rect2 = document.createElement('rect');
    rect2.setAttribute('class', 'rectangleTest');
    rect2.setAttribute('x', '45');
    rect2.setAttribute('y', '100');
    rect2.setAttribute('width', '30');
    rect2.setAttribute('height', '30');
    rect2.setAttribute('fill', 'black');
    rect2.setAttribute('stroke', 'black');
    testRect2.appendChild(rect2);
    document.body.appendChild(rect2);

    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    service['selection']['drawingService'].drawBoard = compiled.querySelector('#drawboard');
    const list: NodeList = compiled.querySelectorAll('.rectangleTest');
    service['selection']['selectionBox']['topLeft'][0] = -300;
    service['selection']['selectionBox']['dimensions'][0] = 100;
    service['selection']['selectionBox']['topLeft'][1] = -300;
    service['selection']['selectionBox']['dimensions'][1] = 100;
    service['selection']['findWithinScaned'](list);
    expect(service['selection'].targets.length).toBe(2);

  });

  it('translate', () => {

    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;

    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);

    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    service['selection']['drawingService'].drawZone = compiled.querySelector('#drawZone');
    service['transformation']['drawingService'].svg = compiled.querySelector('#svg');
    service['transformation']['drawingService'].drawZone = compiled.querySelector('#drawZone');

    const list: NodeList = compiled.querySelectorAll('.rectangleTest');
    // expect(list.length).toBe(5);
    service['selection']['selectionBox']['topLeft'][0] = 45;
    service['selection']['selectionBox']['dimensions'][0] = 100;
    service['selection']['selectionBox']['topLeft'][1] = 100;
    service['selection']['selectionBox']['dimensions'][1] = 100;
    service['selection']['findWithinScaned'](list);

    service['transformation']['lastCommand'].set('rect1', ['allo', 'allo', 'allo']);
    service['transformation']['lastCommand'].set('rect2', ['allo', 'allo', 'allo']);
    service['transformation']['lastCommand'].set('rect0', ['allo', 'allo', 'allo']);

    service['selection'].addTarget(testRect);
    service['transformation'].translate(20, 20);

    expect(testRect.getAttribute('transform')).toEqual('matrix(1 0 0 1 20 20)');
  });

  it('Rotate transformation works properly', () => {
    const testRect1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    testRect1.id = 'rect1';
    testRect1.setAttribute('class', 'papa other fill');
    testRect1.setAttribute('x', '45');
    testRect1.setAttribute('y', '100');
    testRect1.setAttribute('width', '30');
    testRect1.setAttribute('height', '30');

    const rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect1.setAttribute('class', 'rectangleTest fill');
    rect1.setAttribute('x', '45');
    rect1.setAttribute('y', '100');
    rect1.setAttribute('width', '30');
    rect1.setAttribute('height', '30');
    rect1.setAttribute('fill', 'black');

    rect1.setAttribute('stroke', 'black');

    testRect1.appendChild(rect1);

    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    service['selection']['drawingService'].drawZone = compiled.querySelector('#drawZone');
    service['transformation']['drawingService'].svg = compiled.querySelector('#svg');
    service['transformation']['drawingService'].drawZone = compiled.querySelector('#drawZone');

    const list: NodeList = compiled.querySelectorAll('.rectangleTest');
    service['selection']['selectionBox']['topLeft'][0] = 45;
    service['selection']['selectionBox']['dimensions'][0] = 100;
    service['selection']['selectionBox']['topLeft'][1] = 100;
    service['selection']['selectionBox']['dimensions'][1] = 100;
    service['selection']['findWithinScaned'](list);

    service['transformation']['lastCommand'].set('rect1', ['allo', 'allo', 'allo']);
    service['transformation']['lastCommand'].set('rect2', ['allo', 'allo', 'allo']);

    service['selection'].addTarget(testRect1);
    const wheelEvent = new WheelEvent('wheel', { deltaY: 15 });
    const mousemove = new MouseEvent('wheel', { clientX: 15 });
    service.onShiftDown(mousemove);
    service.isAltDown = true;
    service.onWheel(wheelEvent);
    service.onShiftUp(mousemove);
    service.isAltDown = false;
    service.onWheel(wheelEvent);

    const matrix = testRect1.getCTM() as DOMMatrix;

    matrix.a = Math.round(matrix.a * 10000) / 10000;
    matrix.b = Math.round(matrix.b * 10000) / 10000;
    matrix.c = Math.round(matrix.c * 10000) / 10000;
    matrix.d = Math.round(matrix.d * 10000) / 10000;
    matrix.e = Math.round(matrix.e * 10000) / 10000;
    matrix.f = Math.round(matrix.f * 10000) / 10000;
    let translate = 'translate(0, 0)';
    translate = 'matrix(' + matrix.a + ' ' + matrix.b + ' ' + matrix.c + ' ' + matrix.d + ' ' + matrix.e + ' ' + matrix.f + ')';

    testRect1.setAttribute('transform', translate);

    expect(testRect1.getAttribute('transform')).toEqual(
      'matrix(1 0 0 1 0 0)');

  });

  it('If arrowKeyDown of selection called and arrows.get is true, return nothing', () => {
    spyOn<any>(service['transformation'], 'arrowKeyDown').and.callThrough();
    spyOn<any>(service['transformation']['arrows'], 'get').and.returnValue(1);
    const arrowDown: KeyboardEvent = new KeyboardEvent('keydown', { key: 'down arrow' });
    const result = service.arrowKeyDown(arrowDown);
    expect(result).toEqual(['', '']);

    expect(result).toEqual(['', '']);

  });

  it('Reinitiate should change initialSelectedBox', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    service['selection'].reinitiate();
    service['selection']['drawingService'].drawBoard = compiled.querySelector('#drawboard');
    service['selection']['drawingService'].selectedZone = compiled.querySelector('#selectedZone');
    service['selection'].reinitiate();
    const newBox = new Box();
    expect(service['selection'].initialSelectedBox).toEqual(newBox);

  });

  it('If translate of transformation and directTarget false, selection.targets.delete and lastCommand.targets.delete called', () => {
    spyOn<any>(service['transformation'], 'translate').and.callThrough();
    spyOn<any>(service['selection'].targets, 'entries');
    spyOn<any>(service['transformation']['lastCommand'], 'delete');
    spyOn<any>(service['selection'].targets[0], 'has').and.returnValue(false);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRect);
    service['selection'].addTarget(testRect);
    service['selection'].addTarget(testRect);
    service['transformation'].translate(10, 20);

    expect(service['transformation']['lastCommand'].delete).toHaveBeenCalled();
  });

  it('If rotate of transformation and directTarget false, selection.targets.delete and lastCommand.targets.delete called', () => {
    spyOn<any>(service['transformation'], 'translate').and.callThrough();
    spyOn<any>(service['selection'].targets, 'entries');
    spyOn<any>(service['transformation']['lastCommand'], 'delete');
    spyOn<any>(service['selection'].targets[0], 'has').and.returnValue(false);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRect);
    service['selection'].addTarget(testRect);
    service['selection'].addTarget(testRect);
    const wheelEvent = new WheelEvent('wheel', { deltaY: 15 });
    service['transformation'].rotate(wheelEvent, true, true);

    expect(service['transformation']['lastCommand'].delete).toHaveBeenCalled();
  });

  it('If memoriseHtmls of transformation, lastCommand.set called', () => {
    spyOn<any>(service['transformation'], 'memoriseHtmls').and.callThrough();
    spyOn<any>(service['transformation']['lastCommand'], 'set');

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRect);
    service['selection'].addTarget(testRect);
    service['selection'].addTarget(testRect);
    service['transformation'].memoriseHtmls();

    expect(service['transformation']['lastCommand'].set).toHaveBeenCalled();
  });

  it('If onCtrlKey of selection, targets.set called', () => {

    const b: KeyboardEvent = new KeyboardEvent('keydown', { key: 'b', ctrlKey: true });
    expect(service['selection'].onCtrlKey(b)).toEqual(['', '']);

    spyOn<any>(service['selection'], 'onCtrlKey').and.callThrough();
    spyOn<any>(service['selection'].targets[0], 'set');

    service['selection']['button'] = 0;
    // tslint:disable-next-line:no-non-null-assertion
    service['selection']['drawingService'].drawZone!.appendChild(testRect);
    const ctrlKey: KeyboardEvent = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
    service.onCtrlKey(ctrlKey);

    expect(service['selection'].targets[0].set).toHaveBeenCalled();
  });

  it('If addTarget of transformation, selection.targets.clear and selection.targets.set called', () => {
    spyOn<any>(service['transformation'], 'addTarget').and.callThrough();
    spyOn<any>(service['selection'].targets[0], 'clear');
    spyOn<any>(service['selection'].targets[0], 'set');

    service['transformation']['addTarget'](testRect);

    expect(service['selection'].targets[0].clear).toHaveBeenCalled();
    expect(service['selection'].targets[0].set).toHaveBeenCalled();
  });

  it('If addTarget of transformation and button right, targets.has is true, targets.delete called', () => {
    spyOn<any>(service['selection'], 'addTarget').and.callThrough();
    spyOn<any>(service['selection'].targets[1], 'delete');
    spyOn<any>(service['selection'].targets[0], 'has').and.returnValue(true);

    service['selection']['button'] = 2;
    service['selection'].addTarget(testRect);

    expect(service['selection'].targets[1].delete).toHaveBeenCalled();
  });

  it('addTarget with right button add the right targets', () => {
    const testRectParent = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    testRectParent.id = 'rect1';
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    t.setAttribute('x', '5');
    t.setAttribute('y', '5');
    t.setAttribute('width', '5');
    t.setAttribute('height', '5');
    testRectParent.appendChild(t);
    document.body.appendChild(testRectParent);

    service['selection'].selectedBox.topLeft = [5, 5];
    service['selection'].selectedBox.dimensions = [10, 10];

    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    service['selection']['drawingService'].drawBoard = compiled.querySelector('#drawboard');
    service['selection']['drawingService'].selectedZone = compiled.querySelector('#selectedZone');

    service['selection']['button'] = 2;
    service['selection'].addTarget(testRectParent);
    service['selection'].updateSelectedZone();
    expect(service['selection'].targets[1].has('rect1')).toBeTruthy();
  });

  it('addTarget with left button add the right targets and is not affected by other wrong buttons', () => {
    const testRandom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    testRandom.id = 'random1';

    const g = document.createElement('g');
    g.id = 'rect1';
    const t = document.createElement('rect');
    t.setAttribute('x', '5');
    t.setAttribute('y', '5');
    t.setAttribute('width', '5');
    t.setAttribute('height', '5');
    g.appendChild(t);
    drawZone.appendChild(g);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(g);
    service['selection'].updateSelectedZone();

    const g2 = document.createElement('g');
    g2.id = 'rect2';
    const wrongButtonSelect = document.createElement('rect');
    g2.appendChild(wrongButtonSelect);
    service['selection']['button'] = 1;
    drawZone.appendChild(g2);
    service['selection'].addTarget(g2);

    expect(service['selection'].targets[0].has('rect1')).toBeTruthy();
    expect(service['selection'].targets[0].has('rect2')).toBeFalsy();
    expect(service['selection'].targets[0].has('random1')).toBeFalsy();
  });

  it('searchElement find element inside the selectedZone with right button', () => {
    const t = document.createElement('rect');
    t.id = 'rect1';
    t.setAttribute('x', '5');
    t.setAttribute('y', '5');
    t.setAttribute('width', '5');
    t.setAttribute('height', '5');

    selectedZone.setAttribute('x', '5');
    selectedZone.setAttribute('y', '5');
    selectedZone.setAttribute('width', '5');
    selectedZone.setAttribute('height', '5');

    service['selection']['button'] = 2;
    service['selection']['selectionBox'].topLeft[0] = 5;
    service['selection']['selectionBox'].topLeft[1] = 5;
    service['selection']['selectionBox'].bottomRight[0] = 10;
    service['selection']['selectionBox'].bottomRight[1] = 10;

    service['selection'].targets[0].set('rect1', t);
    expect(service['selection'].targets[1].has('rect1')).toBeFalsy();
  });

  it('getCurrentId return 0', () => {
    const result = service.getCurrentId();
    expect(result).toEqual(0);
  });

  it('setCurrentId return', () => {
    const result = service.setCurrentId(1);
    expect(result).toEqual();
  });

  it('copy and paste of clipboard, copiedtargets[0] has the element copied, and selection.addtarget called', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const rect = document.createElement('g');
    rect.id = 'rect1';
    const rec = document.createElement('rect');
    rec.setAttribute('x', '5');
    rec.setAttribute('y', '5');
    rec.setAttribute('width', '5');
    rec.setAttribute('height', '5');
    rect.appendChild(rec);
    drawZone.appendChild(rect);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(rect);
    service['selection'].updateSelectedZone();

    service.clipBoard.copy();
    service.clipBoard.paste();
    expect(service.clipBoard['copiedTargets'][0].has('rect1')).toBeTruthy();
  });

  it('changId of clipboard, should increment of 1 the methond setCurrentId of polygon', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const polygon = document.createElement('g');
    polygon.id = 'polygon0';
    const poly = document.createElement('polygon');
    poly.setAttribute('x', '5');
    poly.setAttribute('y', '5');
    poly.setAttribute('width', '5');
    poly.setAttribute('height', '5');
    polygon.appendChild(poly);
    drawZone.appendChild(polygon);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(polygon);
    service['selection'].updateSelectedZone();

    service.clipBoard.copy();
    service.clipBoard.paste();
    expect(service.clipBoard.tools[6].currentId).toEqual(1);
  });

  it('changId of clipboard, should increment of 1 the methond setCurrentId of pencil', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const pencil = document.createElement('g');
    pencil.id = 'pencil0';
    const pen = document.createElement('pencil');
    pen.setAttribute('x', '5');
    pen.setAttribute('y', '5');
    pen.setAttribute('width', '5');
    pen.setAttribute('height', '5');
    pencil.appendChild(pen);
    drawZone.appendChild(pencil);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(pencil);
    service['selection'].updateSelectedZone();

    service.clipBoard.copy();
    service.clipBoard.paste();
    expect(service.clipBoard.tools[0].currentId).toEqual(1);
  });

  it('changId of clipboard, should increment of 1 the methond setCurrentId of ellip', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const ellipse = document.createElement('g');
    ellipse.id = 'ellipse0';
    const ellip = document.createElement('ellip');
    ellip.setAttribute('x', '5');
    ellip.setAttribute('y', '5');
    ellip.setAttribute('width', '5');
    ellip.setAttribute('height', '5');
    ellipse.appendChild(ellip);
    drawZone.appendChild(ellipse);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(ellipse);
    service['selection'].updateSelectedZone();

    service.clipBoard.copy();
    service.clipBoard.paste();
    expect(service.clipBoard.tools[5]['currentId']).toEqual(1);
  });

  it('changId of clipboard, should increment of 1 the methond setCurrentId of brush', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const brush = document.createElement('g');
    brush.id = 'brush0';
    const brushTest = document.createElement('brush');
    brushTest.setAttribute('x', '5');
    brushTest.setAttribute('y', '5');
    brushTest.setAttribute('width', '5');
    brushTest.setAttribute('height', '5');
    brush.appendChild(brushTest);
    drawZone.appendChild(brush);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(brush);
    service['selection'].updateSelectedZone();

    service.clipBoard.copy();
    service.clipBoard.paste();
    expect(service.clipBoard.tools[1]['currentId']).toEqual(1);
  });

  it('changId of clipboard, should increment of 1 the methond setCurrentId of spray', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const spray = document.createElement('g');
    spray.id = 'spray0';
    const sprayTest = document.createElement('spray');
    sprayTest.setAttribute('x', '5');
    sprayTest.setAttribute('y', '5');
    sprayTest.setAttribute('width', '5');
    sprayTest.setAttribute('height', '5');
    spray.appendChild(sprayTest);
    drawZone.appendChild(spray);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(spray);
    service['selection'].updateSelectedZone();

    service.clipBoard.copy();
    service.clipBoard.paste();
    expect(service.clipBoard.tools[2]['currentId']).toEqual(1);
  });

  it('changId of clipboard, should increment of 1 the methond setCurrentId of line', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const line = document.createElement('g');
    line.id = 'line0';
    const lineTest = document.createElement('line');
    lineTest.setAttribute('x', '5');
    lineTest.setAttribute('y', '5');
    lineTest.setAttribute('width', '5');
    lineTest.setAttribute('height', '5');
    line.appendChild(lineTest);
    drawZone.appendChild(line);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(line);
    service['selection'].updateSelectedZone();

    service.clipBoard.copy();
    service.clipBoard.paste();
    expect(service.clipBoard.tools[3]['currentId']).toEqual(1);
  });

  it('changId of clipboard, should increment of 1 the methond setCurrentId of bucket', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const bucket = document.createElement('g');
    bucket.id = 'bucket0';
    const buck = document.createElement('bucket');
    buck.setAttribute('x', '5');
    buck.setAttribute('y', '5');
    buck.setAttribute('width', '5');
    buck.setAttribute('height', '5');
    bucket.appendChild(buck);
    drawZone.appendChild(bucket);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(bucket);
    service['selection'].updateSelectedZone();

    service.clipBoard.copy();
    service.clipBoard.paste();
    expect(service.clipBoard.tools[7]['currentId']).toEqual(1);
  });

  it('cut of clipboard, copiedtargets[0] has the element copied, and selection.targets should be empty', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const rect = document.createElement('g');
    rect.id = 'rect1';
    const rec = document.createElement('rect');
    rec.setAttribute('x', '5');
    rec.setAttribute('y', '5');
    rec.setAttribute('width', '5');
    rec.setAttribute('height', '5');
    rect.appendChild(rec);
    drawZone.appendChild(rect);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(rect);
    service['selection'].updateSelectedZone();

    service.clipBoard.cut();
    expect(service.clipBoard['copiedTargets'][0].has('rect1')).toBeTruthy();
    expect(service['selection'].targets[0]).toEqual(new Map<string, Element>());
  });

  it('delete of clipboard, selection.targets[0] should be empty', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const rect = document.createElement('g');
    rect.id = 'rect1';
    const rec = document.createElement('rect');
    rec.setAttribute('x', '5');
    rec.setAttribute('y', '5');
    rec.setAttribute('width', '5');
    rec.setAttribute('height', '5');
    rect.appendChild(rec);
    drawZone.appendChild(rect);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(rect);
    service['selection'].updateSelectedZone();

    service.clipBoard.delete();
    expect(service['selection'].targets[0]).toEqual(new Map<string, Element>());
  });

  it('duplicate of clipboard, copiedTargets[2].set called', () => {
    const testRandom = document.createElement('rect');
    testRandom.id = 'random1';

    const rect = document.createElement('g');
    rect.id = 'rect1';
    const rec = document.createElement('rect');
    rec.setAttribute('x', '5');
    rec.setAttribute('y', '5');
    rec.setAttribute('width', '5');
    rec.setAttribute('height', '5');
    rect.appendChild(rec);
    drawZone.appendChild(rect);
    drawZone.appendChild(testRandom);

    service['selection']['button'] = 0;
    service['selection'].addTarget(testRandom);
    service['selection'].addTarget(rect);
    service['selection'].updateSelectedZone();
    service.clipBoard.duplicate();
    expect(service.clipBoard['copiedTargets'][2].has('rect1')).toBeTruthy();
  });

  it('translate, then copy paste, expect element to have a translation of x+=30 and y+=30 due to the paste', () => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.id = 'rect0';
    rect.setAttribute('x', '45');
    rect.setAttribute('y', '300');
    rect.setAttribute('width', '10');
    rect.setAttribute('height', '10');
    rect.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;

    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(rect);

    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    service['selection']['drawingService'].drawZone = compiled.querySelector('#drawZone');
    service['transformation']['drawingService'].svg = compiled.querySelector('#svg');
    service['transformation']['drawingService'].drawZone = compiled.querySelector('#drawZone');

    const list: NodeList = compiled.querySelectorAll('.rectangleTest');
    service['selection']['selectionBox']['topLeft'][0] = 45;
    service['selection']['selectionBox']['dimensions'][0] = 100;
    service['selection']['selectionBox']['topLeft'][1] = 100;
    service['selection']['selectionBox']['dimensions'][1] = 100;
    service['selection']['findWithinScaned'](list);

    service['transformation']['lastCommand'].set('rect0', ['allo', 'allo', 'allo']);

    service['selection'].addTarget(rect);

    service.clipBoard['services'][0].changeDimensionX(1000000000);
    service.clipBoard['services'][0].changeDimensionY(1000000000);

    service.clipBoard.copy();
    service.clipBoard.paste();

    expect(rect.getAttribute('transform')).toEqual('matrix(1 0 0 1 30 30)');
  });

  it('translate, then copy paste, expect element to be copied normaly', () => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.id = 'rect0';
    rect.setAttribute('x', '45');
    rect.setAttribute('y', '300');
    rect.setAttribute('width', '10');
    rect.setAttribute('height', '10');
    rect.setAttribute('transform', 'matrix(1 0 0 1 0 0)');
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;

    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(rect);

    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    service['selection']['drawingService'].drawZone = compiled.querySelector('#drawZone');
    service['transformation']['drawingService'].svg = compiled.querySelector('#svg');
    service['transformation']['drawingService'].drawZone = compiled.querySelector('#drawZone');

    const list: NodeList = compiled.querySelectorAll('.rectangleTest');
    service['selection']['selectionBox']['topLeft'][0] = 45;
    service['selection']['selectionBox']['dimensions'][0] = 100;
    service['selection']['selectionBox']['topLeft'][1] = 100;
    service['selection']['selectionBox']['dimensions'][1] = 100;
    service['selection']['findWithinScaned'](list);

    service['transformation']['lastCommand'].set('rect0', ['allo', 'allo', 'allo']);

    service['selection'].addTarget(rect);

    service.clipBoard['services'][0].changeDimensionX(1);
    service.clipBoard['services'][0].changeDimensionY(1);

    service.clipBoard.copy();
    service.clipBoard.paste();

    expect(rect.getAttribute('transform')).toEqual('matrix(1 0 0 1 0 0)');
  });

  // tslint:disable-next-line:max-file-line-count
});
