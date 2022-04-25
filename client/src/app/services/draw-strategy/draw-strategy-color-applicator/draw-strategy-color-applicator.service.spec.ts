// tslint:disable:no-magic-numbers
// tslint:disable: no-string-literal

import { TestBed } from '@angular/core/testing';

import { DataService } from '../../data-service/data.service';
import { DrawStrategyColorApplicatorService } from './draw-strategy-color-applicator.service';
enum SERVICE_INDEX {COLOR_SERVICES, INVOKER, DRAWING, DATA}

describe('DrawStrategyColorApplicatorService', () => {
  let service: DrawStrategyColorApplicatorService;
  let selectedZone: HTMLElement;
  let drawZone: HTMLElement;
  let svg: HTMLElement;
  let testRect: HTMLElement;
  let child1: HTMLElement;
  let child2: HTMLElement;
  beforeEach(() => TestBed.configureTestingModule({ providers: [DrawStrategyColorApplicatorService, DataService]}));
  beforeEach(async () => {
    service = TestBed.inject(DrawStrategyColorApplicatorService);

    child1 = document.createElement('rect');
    child1.setAttribute('x', '45');
    child1.setAttribute('y', '300');
    child1.setAttribute('width', '10');
    child1.setAttribute('height', '10');
    child1.setAttribute('stroke', 'red');
    child1.setAttribute('fill', 'red');
    child1.setAttribute('class', 'secondary contour fill');
    document.body.appendChild(child1);

    child2 = document.createElement('rect');
    child2.setAttribute('x', '45');
    child2.setAttribute('y', '300');
    child2.setAttribute('width', '10');
    child2.setAttribute('height', '10');
    child2.setAttribute('stroke', 'red');
    child2.setAttribute('fill', 'red');
    child2.setAttribute('class', 'primary contour fill');
    document.body.appendChild(child2);

    testRect = document.createElement('g');
    testRect.id = 'rect0';
    testRect.setAttribute('x', '45');
    testRect.setAttribute('y', '300');
    testRect.setAttribute('width', '10');
    testRect.setAttribute('height', '10');

    testRect.appendChild(child1);
    testRect.appendChild(child2);

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
    element.outerHTML =   '<svg id="svg" version="1.1" baseProfile="full"' +
                          '[attr.width]="dimensionsX" [attr.height]="dimensionsY"' +
                          'xmlns="http://www.w3.org/2000/svg" (mousedown)="onMouseDown($event)"' +
                          '(mousemove)="onMouseMovement($event)" (mouseup)="onMouseUp($event)"' +
                          '(mouseleave)="onMouseOut($event)"></svg>';
    service['services'][SERVICE_INDEX.DRAWING].svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    service['services'][SERVICE_INDEX.DRAWING].svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['services'][SERVICE_INDEX.DATA].changeDimensionX(100);
    service['services'][SERVICE_INDEX.DATA].changeDimensionY(100);
    service['onSelected']();

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('onShiftUp should return an empty string', () => {
    const event = new MouseEvent('mousedown');
    expect(service.onShiftUp(event)).toEqual(['', '']);
  });

  it('onMouseOut should set isClicked to false and return an empty string', () => {
    const event = new MouseEvent('mousedown');
    service['isClicked'] = true;
    expect(service.onMouseOut(event)).toEqual(['', '']);
    expect(service['isClicked']).toBeFalsy();
  });

  it('onEscape should return an empty string', () => {
    const event = new MouseEvent('mousedown');
    expect(service.onEscape(event)).toEqual(['', '']);
  });

  it('onShiftDown should return an empty string', () => {
    const event = new MouseEvent('mousedown');
    expect(service.onShiftDown(event)).toEqual(['', '']);
  });
  it('onCtrlKey should return an empty string', () => {
    const event = new KeyboardEvent('a');
    expect(service.onCtrlKey(event)).toEqual(['', '']);
  });

  it('onBackspace should return an empty string', () => {
    const event = new MouseEvent('mousedown');
    expect(service.onBackspace(event)).toEqual(['', '']);
  });
  it('onMouseUp should should set isClicked to false and return an empty string', () => {
    const event = new MouseEvent('mouseup');
    service['isClicked'] = true;

    expect(service.onMouseUp(event)).toEqual(['', '']);
    expect(service['isClicked']).toBeFalsy();
  });

  it('onMouseMove should call make changesif is painting', () => {
    spyOn(service, 'makeChanges' as never);
    const event = new MouseEvent('mousedown');
    expect(service.onMouseMovement(event)).toEqual(['', '']);
    service['isClicked'] = true;
    service.onMouseMovement(event);
    expect(service['makeChanges']).toHaveBeenCalled();
  });

  it('onMouseDown should call make changesif ', () => {
    spyOn(service, 'makeChanges' as never);
    const event = new MouseEvent('mousedown');
    expect(service.onMouseDown(event, 0)).toEqual(['', '']);
    service['isClicked'] = true;
    expect( service['isClicked']).toBeTruthy();
  });

  it('MakeChanges should call change fill and stroke ', () => {
    spyOn(service, 'changeStroke' as never);
    const click: MouseEvent = new MouseEvent('mousedown', { button: 0, clientX: 50, clientY: 50});
    testRect.dispatchEvent(click);
    service['makeChanges'](click, click.button);
    expect( service['changeStroke']).toHaveBeenCalled();
    spyOn(service, 'changeFill' as never);
    service['makeChanges'](click, 1);
    expect( service['changeFill']).toHaveBeenCalled();

  });
  it('changeStroke changes the stroke and fill depending on classe ', () => {
    service['changeStroke'](0, testRect);
    expect(child1.getAttribute('fill')).toEqual('red');
    expect(child1.getAttribute('stroke')).toEqual('red');
    service['changeStroke'](2, testRect);
    expect(child1.getAttribute('fill')).toEqual('#000000ff');
    expect(child1.getAttribute('stroke')).toEqual('#000000ff');

    child1.setAttribute('class', 'secondary contour');
    child1.setAttribute('stroke', 'red');
    child1.setAttribute('fill', 'red');
    service['changeStroke'](2, testRect);
    expect(child1.getAttribute('fill')).toEqual('red');
    expect(child1.getAttribute('stroke')).toEqual('#000000ff');

    child1.setAttribute('class', 'secondary fill');
    child1.setAttribute('stroke', 'red');
    child1.setAttribute('fill', 'red');
    service['changeStroke'](2, testRect);
    expect(child1.getAttribute('fill')).toEqual('#000000ff');
    expect(child1.getAttribute('stroke')).toEqual('red');

  });

  it('changeFill changes the and fill depending on classe ', async () => {
    const click: MouseEvent = new MouseEvent('mousedown', { button: 0, clientX: 50, clientY: 50});
    service['changeFill'](1, testRect, click);
    expect(child2.getAttribute('fill')).toEqual('red');
    expect(child2.getAttribute('stroke')).toEqual('red');
    service['changeFill'](0, testRect, click);
    expect(child2.getAttribute('fill')).toEqual('#000000ff');
    expect(child2.getAttribute('stroke')).toEqual('#000000ff');

    child2.setAttribute('class', 'primary contour');
    child2.setAttribute('stroke', 'red');
    child2.setAttribute('fill', 'red');
    service['changeFill'](0, testRect, click);
    expect(child2.getAttribute('fill')).toEqual('red');
    expect(child2.getAttribute('stroke')).toEqual('#000000ff');

    child2.setAttribute('class', 'primary fill');
    child2.setAttribute('stroke', 'red');
    child2.setAttribute('fill', 'red');
    service['changeFill'](0, testRect, click);
    expect(child2.getAttribute('fill')).toEqual('#000000ff');
    expect(child2.getAttribute('stroke')).toEqual('red');

    child2.setAttribute('class', 'primary bucket');
    child2.setAttribute('stroke', 'red');
    child2.setAttribute('fill', 'red');
    service['canvas'][1] = document.createElement('canvas');
    service['changeFill'](0, testRect, click);
    await new Promise((done) => setTimeout(() => done(), 2000));
    expect(child2.getAttribute('fill')).toEqual('red');
    expect(child2.getAttribute('stroke')).toEqual('red');

  });

  it('return id works', () => {
    expect(service.getCurrentId()).toBe(0);
  });

  it('we dont need id for this tool', () => {
    service.setCurrentId(50);
    expect(service.getCurrentId()).toBe(0);
  });

  it('setColor should change to color inside the imageData', async () => {
    const color = new Uint8ClampedArray([100, 100, 100, 255]);
    const img = new ImageData(10, 10);
    const img2 = new ImageData(10, 10);

    service['setColor'](0, 0, color, img);
    expect(img).not.toEqual(img2);
  });

  it('compareColors works properly', () => {
    const arr = new Uint8ClampedArray(5);
    arr[0] = 20;
    arr[1] = 20;
    arr[2] = 20;
    arr[3] = 20;
    arr[4] = 20;
    expect(service['compareColors']( arr, arr, 0, 0)).toBeTruthy();
    const arr2 = new Uint8ClampedArray(5);
    arr2[0] = 50;
    arr2[1] = 50;
    arr2[2] = 50;
    arr2[3] = 50;
    arr2[4] = 50;
    expect(service['compareColors']( arr, arr2, 0, 0)).toBeFalsy();
  });

  it('checkValidity works properly', () => {
    const arr = new Uint8ClampedArray(5);
    arr[0] = 20;
    arr[1] = 20;
    arr[2] = 20;
    arr[3] = 20;
    arr[4] = 20;
    const arr2 = new Uint8ClampedArray(5);
    arr2[0] = 50;
    arr2[1] = 50;
    arr2[2] = 50;
    arr2[3] = 50;
    arr2[4] = 50;
    expect(service['checkValidity']( 20, 20, arr, 0, arr, 50, 50, arr2)).toBeTruthy();
  });

  it('floodFill should fill the entire canvas', async () => {
    service['canvas'][0] = document.createElement('canvas');
    // const ctx = (service['canvas'].getContext('2d') as CanvasRenderingContext2D);
    // ctx.beginPath();
    // ctx.rect(0, 0, 100, 100);
    // ctx.fillStyle = 'red';
    // ctx.fill();

    service['onSelected']();
    await new Promise((done) => setTimeout(() => done(), 2000));
    const spy = spyOn(service, 'checkValidity' as never).and.returnValues(true as never, true as never, true as never, true as never);
    const color = new Uint8ClampedArray([100, 100, 100, 255]);
    service['floodFill'](service['canvas'][0], 50, 50, color);
    expect(spy).toHaveBeenCalledTimes(20);
  });
  it('doOperation should do the right operation if op is fill', () => {
    spyOn(service, 'compareColors' as never).and.returnValue(true as never);
    service['services'][SERVICE_INDEX.DATA].changeDimensionX(100);
    service['services'][SERVICE_INDEX.DATA].changeDimensionY(100);
    service['onSelected']();
    const color = new Uint8ClampedArray([255, 255, 255, 255]);
    expect(service['floodFill'](service['canvas'][0], 10, 10, color)).toEqual();
  });
  it('mouseDown should return ["", ""]' , () => {
    service['canClick'] = false;
    const event = new MouseEvent('mousedown');

    expect(service.onMouseDown(event, 2)).toEqual(['', '']);
  });
  it('mouseUp should return ["", ""]' , () => {
    service['canClick'] = false;
    const event = new MouseEvent('mouseUp');

    expect(service.onMouseUp(event)).toEqual(['', '']);
  });
});
