/* tslint:disable:no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { DataService } from '../../data-service/data.service';
import { DrawStrategySprayService } from './draw-strategy-spray.service';

describe('Service: DrawStrategySpray', () => {
  let service: DrawStrategySprayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawStrategySprayService, DataService]
    });
  });
  beforeEach(() => {
    service = TestBed.inject(DrawStrategySprayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('onMouseDown adds the first points and starts painting', () => {
    service.points = 'points here!';
    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate);
    const bool = service.points === '';
    expect(bool).toBeFalsy();
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
    const firstTag = service.onMouseDown(coordinate1); // il devrait etre la

    const coordinate2 = new MouseEvent('mousemove', { clientX: 52, clientY: 5 });
    const secondTag = service.onMouseMovement(coordinate2); // il devrait etre

    expect(firstTag === secondTag).toBeFalsy();
  });
  it('onMouseUp and onMouseOut should stop painting', () => {

    const coordinate0 = new MouseEvent('mouseup');
    expect(service.onMouseUp(coordinate0)).toEqual(['', '']);
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
    expect(service.onMouseUp(coordinate5)).toEqual(['', '']);
    service.onMouseOut(coordinate5);
    service.onMouseDown(coordinate4);
    const coordinate6 = new MouseEvent('mousemove', { clientX: 52, clientY: 52 });
    service.onMouseMovement(coordinate6);
    service.onMouseOut(coordinate5);
    expect(service.points).toEqual('');

  });

  it('points within the radius are randomly generated', () => {
    const coordinate1 = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    let firstTag = '';
    while (firstTag === '') {
      service.onMouseDown(coordinate1);
      firstTag = service.points;
    }
    expect(service.points !== '').toBeTruthy();

    const coordinate2 = new MouseEvent('mouseup');
    service.onMouseUp(coordinate2);
    expect(service.points).toEqual('');

    const coordinate3 = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    let secondTag = '';
    while (secondTag === '') {
      service.onMouseDown(coordinate3);
      secondTag = service.points;
    }
    expect(service.points !== '').toBeTruthy();

    const coordinate4 = new MouseEvent('mouseup');
    service.onMouseUp(coordinate4);
    expect(service.points).toEqual('');

    const coordinate5 = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    let thirdTag = '';
    while (thirdTag === '') {
      service.onMouseDown(coordinate5);
      thirdTag = service.points;
    }
    expect(service.points !== '').toBeTruthy();

    expect(firstTag === secondTag && firstTag === thirdTag && secondTag === thirdTag).toBeFalsy();
  });

  it('tagReturner returns the correct tag', () => {
    const coordinate2 = new MouseEvent('mousedown', { clientX: 52, clientY: 5 });
    // tslint:disable-next-line:no-string-literal
    service['isPainting'] = true;
    service.points = 'Ceci devrait etre la place des this.points';
    const result: [string, string] = service.onEscape(coordinate2);

    const expectedResult: [string, string] = [
      'spray' + 0,
      '<g id="spray0" class="contour" x="0" y="0" width="0" height="0">' +
      'Ceci devrait etre la place des this.points' +
      '</g>',
    ];
    expect(result).toEqual(expectedResult);
  });

  it('onEscape should call tagReturner', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    let result: [string, string] = service.onEscape(coordinate);
    expect(result).toEqual(['', '']);
    // tslint:disable-next-line:no-string-literal
    service['isPainting'] = true;
    const expectedResult: [string, string] = ['spray0',
    '<g id="spray0" class="contour" x="0" y="0" width="0" height="0"></g>'];
    result = service.onEscape(coordinate);
    expect(result).toEqual(expectedResult);
  });

  it('onBackspace should call tagReturner', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    let result: [string, string] = service.onBackspace(coordinate);
    expect(result).toEqual(['', '']);
    // tslint:disable-next-line:no-string-literal
    service['isPainting'] = true;
    const expectedResult: [string, string] = ['spray0',
    '<g id="spray0" class="contour" x="0" y="0" width="0" height="0"></g>'];
    result = service.onBackspace(coordinate);
    expect(result).toEqual(expectedResult);
  });
  it('shift down and up calls tagReturner', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    let result: [string, string] = service.onShiftDown(coordinate);
    expect(result).toEqual(['', '']);

    let result2: [string, string] = service.onShiftUp(coordinate);
    expect(result).toEqual(['', '']);
    // tslint:disable-next-line:no-string-literal
    service['isPainting'] = true;
    const expectedResult: [string, string] = ['spray0',
    '<g id="spray0" class="contour" x="0" y="0" width="0" height="0"></g>'];
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
    service.setCurrentId(500);
    expect(service.getCurrentId()).toBe(500);
  });

  it('controle key does nothing', () => {
    expect(service.onCtrlKey(new KeyboardEvent('keypress', { key: 'l' }))).toEqual(['', '']);
});
});
