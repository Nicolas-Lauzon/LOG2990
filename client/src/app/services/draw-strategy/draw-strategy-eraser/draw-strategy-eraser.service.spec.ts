// tslint:disable:no-string-literal
// tslint:disable:no-non-null-assertion
// tslint:disable:no-magic-numbers
// tslint:disable:max-file-line-count

import { TestBed } from '@angular/core/testing';
import { DrawingSpaceComponent } from 'src/app/components/app/main-page/drawing-space/drawing-space.component';
import { DataService } from './../../data-service/data.service';
import { DrawStrategyEraserService } from './draw-strategy-eraser.service';

describe('DrawStrategyEraserService', () => {
  let service: DrawStrategyEraserService;
  let testRect: HTMLElement;
  let selectedZone: HTMLElement;
  let drawZone: HTMLElement;
  let svg: HTMLElement;
  let rect1: HTMLElement;
  let rect2: HTMLElement;
  let testRect1: HTMLElement;
  let testRect2: HTMLElement;
  let rect: HTMLElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawStrategyEraserService, DataService],
      declarations: [DrawingSpaceComponent]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DrawStrategyEraserService);

    testRect = document.createElement('g');
    testRect.id = 'rect0';
    testRect.setAttribute('class', 'papa');
    testRect.setAttribute('x', '45');
    testRect.setAttribute('y', '100');
    testRect.setAttribute('width', '500000');
    testRect.setAttribute('height', '500000');

    rect = document.createElement('rect');
    rect.setAttribute('class', 'rectangleTest');
    rect.setAttribute('x', '45');
    rect.setAttribute('y', '100');
    rect.setAttribute('width', '500000');
    rect.setAttribute('height', '500000');
    rect.setAttribute('stroke-width', '50');
    rect.setAttribute('style', 'fill: blue; stroke: black ; stroke-width: 50');

    testRect.appendChild(rect);

    testRect1 = document.createElement('g');
    testRect1.id = 'rect1';
    testRect1.setAttribute('class', 'papa other fill');
    testRect1.setAttribute('x', '45');
    testRect1.setAttribute('y', '100');
    testRect1.setAttribute('width', '500000');
    testRect1.setAttribute('height', '500000');

    rect1 = document.createElement('rect');
    rect1.setAttribute('class', 'rectangleTest fill');
    rect1.setAttribute('x', '45');
    rect1.setAttribute('y', '100');
    rect1.setAttribute('width', '5000000');
    rect1.setAttribute('height', '5000000');
    rect1.setAttribute('fill', 'black');

    rect1.setAttribute('stroke', 'black');

    testRect1.appendChild(rect1);
    testRect2 = document.createElement('g');
    testRect2.id = 'rect2';
    testRect2.setAttribute('class', 'papa contour');
    testRect2.setAttribute('x', '45');
    testRect2.setAttribute('y', '100');
    testRect2.setAttribute('width', '50000000');
    testRect2.setAttribute('height', '50000000');

    rect2 = document.createElement('rect');
    rect2.setAttribute('class', 'rectangleTest');
    rect2.setAttribute('x', '45');
    rect2.setAttribute('y', '100');
    rect2.setAttribute('width', '50000000');
    rect2.setAttribute('height', '50000000');
    rect2.setAttribute('fill', 'black');
    rect2.setAttribute('stroke', 'black');

    testRect2.appendChild(rect2);

    drawZone = document.createElement('g');
    drawZone.id = 'drawZone';
    drawZone.setAttribute('x', '45');
    drawZone.setAttribute('y', '100');
    drawZone.setAttribute('width', '500000000');
    drawZone.setAttribute('height', '50000000');
    drawZone.appendChild(testRect);
    drawZone.appendChild(testRect1);
    drawZone.appendChild(testRect2);

    selectedZone = document.createElement('g');
    selectedZone.id = 'selectedZone';

    svg = document.createElement('svg');
    svg.id = 'svg';
    svg.setAttribute('width', '500000000');
    svg.setAttribute('height', '500000000');
    svg.appendChild(drawZone);
    svg.appendChild(selectedZone);
    document.body.appendChild(svg);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onMouseMove calls onMousemove and eraser selection ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const spy = spyOn(service['selection'], 'onMouseMovement');
    service.onMouseMovement(move);
    expect(service.onMouseMovement(move)).toEqual(['', '']);
    expect(spy).toHaveBeenCalled();
    service['isPainting'] = true;
    const spy2 = spyOn(service['selection'], 'eraseSelection');
    service.onMouseMovement(move);
    expect(spy2).toHaveBeenCalled();
    service['isPainting'] = false;
    expect(service.onMouseMovement(move)).toEqual(['', '']);

  });
  it('selection.onMouseMove calls all fonctions needed ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const spy = spyOn(service['selection'], 'cursorSquare' as never);
    const spy1 = spyOn(service['selection'], 'squareSelect' as never);
    const spy2 = spyOn(service['selection']['styler'], 'changeStyle');
    service['selection'].onMouseMovement(move);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('changeStyle of styler and id includes bucket, toMostElement = bucket ', () => {
    const bucket = document.createElement('bucket');
    bucket.id = 'bucket0';
    bucket.setAttribute('x', '45');
    bucket.setAttribute('y', '100');
    bucket.setAttribute('width', '500000');
    bucket.setAttribute('height', '500000');

    bucket.appendChild(testRect);

    service['styler'].topMostElement = bucket;
    service['styler'].changeStyle();
    expect(service['styler'].topMostElement).toEqual(bucket);
  });

  it('restoreStyle of styler and id includes bucket, topMostElement = null ', () => {
    const bucket = document.createElement('bucket');
    bucket.id = 'bucket0';
    bucket.setAttribute('x', '45');
    bucket.setAttribute('y', '100');
    bucket.setAttribute('width', '500000');
    bucket.setAttribute('height', '500000');

    bucket.appendChild(testRect);

    service['styler'].topMostElement = bucket;
    service['styler'].restoreStyle();
    expect(service['styler'].topMostElement).toBeNull();
  });

  it('restoreStyle of styler and id includes bucket, topMostElement =  ', () => {
    const bucket = document.createElement('bucket');
    bucket.id = 'bucket0';
    bucket.setAttribute('x', '45');
    bucket.setAttribute('y', '100');
    bucket.setAttribute('width', '500000');
    bucket.setAttribute('height', '500000');

    bucket.appendChild(testRect);
    bucket.appendChild(rect);

    service['styler'].topMostElement = bucket;
    service['styler'].restoreStyle();
    expect(service['styler'].topMostElement).toEqual(bucket);
  });

  it('onMouseDown calls onMousemove and eraser selection and selection.onMouseDown works properly ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const spy = spyOn(service['selection'], 'onMouseDown');
    service.onMouseDown(move);
    expect(spy).toHaveBeenCalled();
    expect(service.onMouseDown(move)).toEqual(['', '']);
  });
  it('selection.onMouseDown calls all fonctions needed ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const spy1 = spyOn(service['selection'], 'squareSelect' as never);
    service['selection'].onMouseDown(move);
    expect(spy1).toHaveBeenCalled();
    service['selection'].topMostElement = testRect;
    const spy2 = spyOn(service['selection'].targets, 'clear');
    const spy3 = spyOn(service['selection']['styler'], 'restoreStyle');
    const spy4 = spyOn(service['selection']['styler'], 'memoriseStyle');
    const spy5 = spyOn(service['selection']['drawingService'], 'replaceTag');
    service['selection'].onMouseDown(move);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
    expect(service['selection']['elementErased'].includes(testRect)).toBeTruthy();
    expect(service['selection'].topMostElement).toBeNull();
    expect(service['selection']['styler'].topMostElement).toBeNull();

  });
  it('selection.squareselect calls all fonctions needed ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const spy = spyOn(service['selection'], 'elementsWithinRange' as never);
    const spy1 = spyOn(service['selection'], 'listSelect' as never);
    service['selection']['squareSelect'](move);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('cursorSquare and drawingService.cursor true, drawingService.cursorSquare.innerHTML to equal the square', () => {
    spyOn(service['selection']['drawingService'], 'cursorSquare' as never);
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    service['selection']['cursorSquare'](move);
    expect(service['selection']['drawingService'].cursorSquare!.innerHTML).toEqual(
      '<rect width="3" height="3" pointer-events= "none" fill="#ffffffaa" stroke="black" x="48.5" y="48.5">');
  });

  it('elementsWithinRange, return the intersections', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    expect(service['selection']['elementsWithinRange']().length).toBe(0);
  });

  it('setCurrentId return nothing', () => {
    spyOn(service, 'setCurrentId').and.callThrough();
    service.setCurrentId(0);
    expect(service['setCurrentId']).toHaveBeenCalled();
  });

  it('finTopMost and target.Size = 0, return null', () => {
    const result = service['selection']['findTopMost']();
    expect(result).toEqual(null);
  });

  it('finTopMost and target.Size = 2, return drawings[i]', () => {
    service['selection']['drawingService'].drawZone = svg.querySelector('#drawZone');
    service['selection']['drawingService'].drawZone!.appendChild(testRect);
    service['selection']['drawingService'].drawZone!.appendChild(testRect1);
    service['selection']['drawingService'].drawZone!.appendChild(testRect2);
    service['selection']['targets'].set('rect1', testRect);
    service['selection']['targets'].set('rect2', testRect1);
    const result = service['selection']['findTopMost']();
    expect(result).toEqual(testRect2);
  });

  it('searchScanX and (elementToFind.id === (targetP as Element).id false, return false', () => {
    const result = service['selection']['searchScanX'](5, 10, 7, rect2);
    expect(result).toEqual(true);

    const result2 = service['selection']['searchScanX'](0, 100, 100, testRect);
    expect(result2).toEqual(false);
  });

  it('searchScanY and (elementToFind.id === (targetP as Element).id false, return false', () => {
    const result = service['selection']['searchScanY'](5, 10, 7, testRect);
    expect(result).toEqual(false);

    const result2 = service['selection']['searchScanY'](5, 10, 7, rect2);
    expect(result2).toEqual(true);
  });

  it('minBoudarie and value>from and value<to, return value', () => {
    const result = service['selection']['minBoundarie'](5, 10, 7);
    expect(result).toEqual(7);
  });

  it('minBoudarie and value<from and value<to, return from', () => {
    const result = service['selection']['minBoundarie'](5, 10, 4);
    expect(result).toEqual(5);
  });

  it('maxBoudarie and value>from and value<to, return value', () => {
    const result = service['selection']['maxBoundarie'](5, 10, 7);
    expect(result).toEqual(7);
  });

  it('maxBoudarie and value<from and value<to, return to', () => {
    const result = service['selection']['maxBoundarie'](5, 10, 4);
    expect(result).toEqual(10);
  });

  it('onMouseUp do nothing', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const spy = spyOn(service['selection'], 'onMouseUp');
    service.onMouseUp(move);
    expect(spy).toHaveBeenCalled();
  });

  it('selection.onMouseUp calls all fonctions needed ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const spy = spyOn(service['selection'], 'cursorSquare' as never);
    const spy1 = spyOn(service['selection']['drawingInvoker'], 'do');
    service['selection']['elementErased'].push(testRect);
    service['selection']['elementErased'].push(testRect1);
    service['selection']['elementErased'].push(testRect2);
    service['selection'].onMouseUp(move);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(service['selection']['elementErased']).toEqual([]);

  });

  it('selection.eraseSelection calls all fonctions needed ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const spy = spyOn(service['selection'].targets, 'clear');
    const spy1 = spyOn(service['selection']['styler'], 'memoriseStyle');
    const spy2 = spyOn(service['selection']['styler'], 'restoreStyle');
    service['selection'].topMostElement = testRect;
    expect(service['selection'].eraseSelection()).toEqual([testRect.id, '']);
    service['selection'].eraseSelection();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(service['selection']['elementErased'].includes(testRect)).toBeTruthy();
    expect(service['selection'].topMostElement).toBeNull();
    expect(service['selection']['styler'].topMostElement).toBeNull();

    service['selection'].topMostElement = null;
    service['selection'].eraseSelection();
    expect(service['selection'].eraseSelection()).toEqual(['', '']);

  });

  it('selection.memoriseTargets ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const list: NodeList = compiled.querySelectorAll('.rectangleTest');
    service['selection']['memoriseTargets'](list);
    expect(service['selection'].targets.size).toBe(list.length);
  });

  it('selection.listSelect works as expected ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const li: NodeList = compiled.querySelectorAll('.asdasdasdasdasdasd');
    service['selection']['listSelect'](li);
    expect(service['selection']['styler'].topMostElement).toBe(null);
    expect(service['selection'].topMostElement).toBe(null);
    const list: NodeList = compiled.querySelectorAll('.papa');
    service['selection'].topMostElement = testRect2;
    const spy = spyOn(service['selection'], 'findTopMostWithinRange' as never);
    const spy1 = spyOn(service['selection']['styler'], 'memoriseStyle');
    service['selection']['listSelect'](list);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('selection.findTopMostWithinRange works ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    service['selection']['drawingService'].drawZone = compiled.querySelector('#drawZone');
    service['selection'].targets.set(testRect.id, testRect);
    service['selection'].targets.set(testRect1.id, testRect1);
    service['selection'].targets.set(testRect2.id, testRect2);

    expect(service['selection']['findTopMostWithinRange']()).toEqual(null);

  });

  it('selection.elementInEnclosure works ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const list: NodeList = compiled.querySelectorAll('.rectangleTest');
    expect(service['selection']['elementInEnclosure'](list, rect)).toBeFalsy();
    expect(service['selection']['elementInEnclosure'](list, testRect2)).toBeTruthy();

  });

  it('onMouseOut calls onMouseOut', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    const move: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    service['selection']['drawingService'].cursorSquare = compiled.querySelector('#svg');
    const spy = spyOn(service['selection'], 'onMouseOut');
    service.onMouseOut(move);
    expect(spy).toHaveBeenCalled();
  });
  it('onMouseOut and drawingService.cursor true, drawingService.cursorSquare.innerH TML = ""', () => {
    spyOn(service['selection']['drawingService'], 'cursorSquare' as never);
    const click: MouseEvent = new MouseEvent('mouseout', { button: 0, clientX: 50, clientY: 50 });
    service.onMouseOut(click);
    expect(service['selection']['drawingService']['cursorSquare']!.innerHTML).toEqual('');
    service.onMouseOut(click);
    service['selection']['drawingService'].cursorSquare = null;
    expect(service['selection'].onMouseOut(click)).toEqual(['', '']);
  });
  it('onBackSpace do nothing', () => {
    const shiftADown: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50 });
    const result = service.onBackspace(shiftADown);
    expect(result).toEqual(['', '']);
  });
  it('onEscape do nothing', () => {
    const result = service.onEscape();
    expect(result).toEqual(['', '']);
  });
  it('onShift do nothing', () => {
    const shiftADown: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50, shiftKey: true });
    const shiftAUp: MouseEvent = new MouseEvent('mousemove', { button: 0, clientX: 50, clientY: 50, shiftKey: false });
    let result = service.onShiftDown(shiftADown);
    expect(result).toEqual(['', '']);
    result = service.onShiftUp(shiftAUp);
    expect(result).toEqual(['', '']);
  });

  it('onCtrlKey do nothing', () => {
    const ctrlKey: KeyboardEvent = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
    const result = service.onCtrlKey(ctrlKey);
    expect(result).toEqual(['', '']);
  });

  it('getCurrentId return 0', () => {
    const result = service.getCurrentId();
    expect(result).toEqual(0);
  });

  it('memoriseStyle should store drawings style', () => {
    service['styler'].ancientStyle = [];
    service['styler'].topMostElement = testRect;
    service['styler'].memoriseStyle();
    expect(service['styler'].ancientStyle[0]).toEqual('fill: blue; stroke: black ; stroke-width: 50');
  });

  it('change stroke should change stroke width', () => {
    service['styler']['changeStroke'](rect);
    expect(rect.style.strokeWidth).not.toEqual('50');
    service['styler']['changeStroke'](rect2);
    expect(rect2.style.strokeWidth).toEqual('5');
  });

  it('change style should change atrtributes ', () => {
    service['styler'].topMostElement = null;
    service['styler'].changeStyle();
    service['styler'].topMostElement = testRect;
    const spy = spyOn(service['styler'], 'addContour' as never);
    service['styler'].changeStyle();
    expect(spy).toHaveBeenCalled();

    service['styler'].topMostElement = testRect1;
    const spy1 = spyOn(service['styler'], 'changeFillsAndStrokes' as never);
    service['styler'].changeStyle();
    expect(spy1).toHaveBeenCalled();

    service['styler'].topMostElement = testRect2;
    const spy2 = spyOn(service['styler'], 'changeStrokes' as never);
    service['styler'].changeStyle();
    expect(spy2).toHaveBeenCalled();

  });

  it('restore style shouls restore previos style ', () => {
    service['styler'].topMostElement = null;
    service['styler'].restoreStyle();
    service['styler'].topMostElement = testRect;
    service['styler'].ancientStyle = [];
    service['styler'].ancientStyle[0] = 'fill: black; stroke: blue ; stroke-width: 5';
    service['styler'].restoreStyle();
    expect(rect.getAttribute('style')).toEqual('fill: black; stroke: blue ; stroke-width: 5');
  });

  it('change strokes shapes ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);

    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const li = compiled.getElementsByTagName('g');

    const spy2 = spyOn(service['styler'], 'changeStroke' as never);
    service['styler']['changeStrokes'](li);
    expect(spy2).not.toHaveBeenCalled();

    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    service['styler']['changeStrokes'](li);
    expect(spy2).toHaveBeenCalled();

  });

  it('change fill and stroke  ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);

    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const li = compiled.getElementsByTagName('rect');

    service['styler']['changeFillsAndStrokes'](li);
    expect(rect1.style.fill).toEqual('rgb(255, 0, 0)');

  });

  it('add contour shold change attributes to stroke width 5 and stroke red  ', () => {
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);

    service['selection']['drawingService'].svg = compiled.querySelector('#svg');
    const li = compiled.getElementsByTagName('rect');

    service['styler']['addContour'](li);
    expect(rect.style.stroke).toEqual('rgb(255, 0, 0)');
    expect(rect.style.strokeWidth).toEqual('5');

    expect(rect1.style.stroke).toEqual('rgb(255, 0, 0)');
    expect(rect1.style.strokeWidth).toEqual('5');

    expect(rect2.style.stroke).toEqual('rgb(255, 0, 0)');
    expect(rect2.style.strokeWidth).toEqual('5');

  });

  it('searchElement of selection called and found true, return found ', () => {
    spyOn(service['selection'], 'isSearchedElementEnclosed').and.returnValue(true);

    service['selection']['searchElement'](testRect);
    expect(service['selection']['isSearchedElementEnclosed']).toHaveBeenCalled();
  });

  it('searchElement of selection called and first searchScanX true, return found ', () => {
    spyOn(service['selection'], 'searchScanX').and.returnValue(true);
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');

    service['selection']['searchElement'](testRect);
    expect(service['selection']['searchScanX']).toHaveBeenCalled();
  });

  it('searchElement of selection called and second searchScanX true, return found ', () => {
    spyOn(service['selection'], 'searchScanX').and.returnValues(false, true);
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');

    service['selection']['searchElement'](testRect);
    expect(service['selection'].searchScanX).toHaveBeenCalled();
  });

  it('searchElement of selection called and fisrt searchScanY true, return found ', () => {
    spyOn(service['selection'], 'searchScanY').and.returnValue(true);
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');

    service['selection']['searchElement'](testRect);
    expect(service['selection'].searchScanY).toHaveBeenCalled();
  });

  it('searchElement of selection called and second searchScanY true, return found ', () => {
    spyOn(service['selection'], 'searchScanY').and.returnValues(false, true);
    const fixture = TestBed.createComponent(DrawingSpaceComponent);
    const compiled = fixture.debugElement.nativeElement;
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect1);
    (compiled.querySelector('#drawZone') as SVGSVGElement).appendChild(testRect2);
    service['selection']['drawingService'].svg = compiled.querySelector('#svg');

    service['selection']['searchElement'](testRect);
    expect(service['selection'].searchScanY).toHaveBeenCalled();
  });

});
