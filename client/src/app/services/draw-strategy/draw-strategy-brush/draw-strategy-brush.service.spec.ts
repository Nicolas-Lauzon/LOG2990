/* tslint:disable:no-magic-numbers */
// tslint:disable:no-string-literal

import { TestBed } from '@angular/core/testing';
import { DataService } from './../../data-service/data.service';
import { DrawStrategyBrushService, USER_OPTION } from './draw-strategy-brush.service';

describe('Service: DrawStrategyBrush', () => {
  let service: DrawStrategyBrushService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawStrategyBrushService, DataService]
    });
  });
  beforeEach(() => {
    service = TestBed.inject(DrawStrategyBrushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.userOptions[USER_OPTION.WIDTH]).toBe(1);
    expect(service.userOptions[USER_OPTION.FILTER]).toEqual('filter0');
    expect(service.points).toEqual('');
  });
  it('onMouseDown adds the first points and starts painting', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate);
    const result: string = '' + coordinate.offsetX + ',' + coordinate.offsetY + ' ' +
      '' + (coordinate.offsetX + 1) + ',' + (coordinate.offsetY + 1) + ' ';
    expect(service.points).toBe(result);
  });

  it('onMouseMovement doesnt add points if its not painting', () => {
    const coordinate = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.onMouseMovement(coordinate);
    expect(service.points).toBe('');
  });

  it('onMouseMovement adds  points after mousedown', () => {
    const coordinate0 = new MouseEvent('mousemove', { clientX: 10, clientY: 10 });
    service.onMouseMovement(coordinate0); // il doit pas etre la
    expect(service.points).toEqual('');
    const coordinate1 = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate1); // il devrait etre la

    const coordinate2 = new MouseEvent('mousemove', { clientX: 52, clientY: 5 });
    service.onMouseMovement(coordinate2); // il devrait etre

    const result: string = '' + coordinate1.offsetX + ',' + coordinate1.offsetY + ' ' +
      '' + (coordinate1.offsetX + 1) + ',' + (coordinate1.offsetX + 1) + ' ' +
      '' + coordinate2.offsetX + ',' + coordinate2.offsetY + ' ';
    expect(service.points).toBe(result);
  });
  it('onMouseUp and onMouseOut should stop painting', () => {
    const coordinate0 = new MouseEvent('mouseup');
    expect(service.onMouseOut(coordinate0)).toEqual(['', '']);
    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate);
    const coordinate2 = new MouseEvent('mouseup');
    service.onMouseUp(coordinate2);
    const coordinate3 = new MouseEvent('mousemove', { clientX: 52, clientY: 52 });
    service.onMouseMovement(coordinate3);
    expect(service.points).toEqual('');

    const coordinate4 = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate4);
    const coordinate5 = new MouseEvent('mouseleave');
    service.onMouseOut(coordinate5);
    const coordinate6 = new MouseEvent('mousemove', { clientX: 52, clientY: 52 });
    service.onMouseMovement(coordinate6);
    expect(service.points).toEqual('');
  });

  it('onMouseUp should reset points', () => {
    const coordinate2 = new MouseEvent('mouseup');
    expect(service.onMouseUp(coordinate2)).toEqual(['', '']);

    const coordinate = new MouseEvent('mousedown');
    service.onMouseDown(coordinate);

    service.onMouseUp(coordinate2);
    expect(service.points).toBe('');
  });

  it('assembleResult returns the correct tag', () => {
    const coordinate1 = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate1);

    const coordinate2 = new MouseEvent('mousemove', { clientX: 52, clientY: 5 });
    const result: [string, string] = service.onMouseMovement(coordinate2);

    const expectedResult: [string, string] = [
      'brush' + 0,
      '<g id="brush0" class="contour" x="49.5" y="4.5" width="3" height="46"' +
      ' filter="url(#filter0)"><polyline class="primary contour"stroke="#000000ff"' +
      ' fill="none" stroke-width="1" points="50,50 51,51 52,5 " ' +
      'style="shape-rendering:geometricPrecision;stroke-linecap:round;stroke-linejoin:round" /></g>'
    ];
    expect(result).toEqual(expectedResult);
  });

  it('onEscape should call assembleResult', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    let result: [string, string] = service.onEscape(coordinate);
    expect(result).toEqual(['', '']);
    // tslint:disable-next-line:no-string-literal
    service['isPainting'] = true;
    const expectedResult: [string, string] = ['brush0',
    '<g id="brush0" class="contour" x="-0.5" y="-0.5" width="1" height="1" filter="url(#filter0)">' +
    '<polyline class="primary contour"stroke="#000000ff" fill="none" stroke-width="1" points="" ' +
    'style="shape-rendering:geometricPrecision;stroke-linecap:round;stroke-linejoin:round" /></g>'
  ];
    result = service.onEscape(coordinate);
    expect(result).toEqual(expectedResult);
  });

  it('onBackspace should call assembleResult', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    let result: [string, string] = service.onBackspace(coordinate);
    expect(result).toEqual(['', '']);
    // tslint:disable-next-line:no-string-literal
    service['isPainting'] = true;
    const expectedResult: [string, string] = ['brush0',
    '<g id="brush0" class="contour" x="-0.5" y="-0.5" width="1" height="1" filter="url(#filter0)">' +
    '<polyline class="primary contour"stroke="#000000ff" fill="none" stroke-width="1" points="" ' +
    'style="shape-rendering:geometricPrecision;stroke-linecap:round;stroke-linejoin:round" /></g>'
  ];
    result = service.onBackspace(coordinate);
    expect(result).toEqual(expectedResult);
  });
  it('shift down and up calls assembleResult', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    let result: [string, string] = service.onShiftDown(coordinate);
    expect(result).toEqual(['', '']);

    let result2: [string, string] = service.onShiftUp(coordinate);
    expect(result).toEqual(['', '']);
    // tslint:disable-next-line:no-string-literal
    service['isPainting'] = true;
    const expectedResult: [string, string] = ['brush0',
    '<g id="brush0" class="contour" x="-0.5" y="-0.5" width="1" height="1" filter="url(#filter0)">' +
    '<polyline class="primary contour"stroke="#000000ff" fill="none" stroke-width="1" ' +
    'points="" style="shape-rendering:geometricPrecision;stroke-linecap:round;stroke-linejoin:round" /></g>'
  ];
    result2 = service.onShiftUp(coordinate);
    result = service.onShiftDown(coordinate);
    expect(result).toEqual(expectedResult);
    expect(result2).toEqual(expectedResult);
  });
  it('return id works', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    for (let i = 0 ; i < 10 ; i++) {
      expect(service.getCurrentId()).toBe(i);
      service.onMouseDown(coordinate);
      service.onMouseOut(coordinate);
    }
    expect(service.getCurrentId()).toBe(10);
  });

  it('controle key does nothing', () => {
    expect(service.onCtrlKey(new KeyboardEvent('keypress', { key: 'l' }))).toEqual(['', '']);
  });

  it('onMouseMovement conversions', () => {
    service['outterBox'].bottomRight = [50, 50];
    service['outterBox'].topLeft = [20, 20];
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service['isPainting'] = true;
    service.onMouseMovement(coordinate);
    expect(service['outterBox'].bottomRight).toEqual([50, 50]);
    expect(service['outterBox'].topLeft).toEqual([0, 0]);

    service['outterBox'].bottomRight = [50, 50];
    service['outterBox'].topLeft = [20, 20];

    const coordinate1 = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
    service.onMouseMovement(coordinate1);
    expect(service['outterBox'].bottomRight).toEqual([100, 100]);
    expect(service['outterBox'].topLeft).toEqual([20, 20]);

  });

});
