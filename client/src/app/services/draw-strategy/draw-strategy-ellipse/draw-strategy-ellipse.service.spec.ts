/* tslint:disable:no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { DataService } from '../../data-service/data.service';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { INDEX } from '../box';
import { DrawStrategyEllipseService } from './draw-strategy-ellipse.service';

describe('Service: DrawStrategyElipse', () => {
  let service: DrawStrategyEllipseService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawStrategyEllipseService, DrawInvokerService, DataService]
    });
  });
  beforeEach(() => {
    service = TestBed.inject(DrawStrategyEllipseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.attributes[1]).toEqual('');
    expect(service.attributes[0]).toBe(1);
  });

  it('onMouseDown should start painting', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate);

    expect(service.selectionBox.startPosition[INDEX.X]).toEqual(50);
    expect(service.selectionBox.startPosition[INDEX.Y]).toEqual(50);
  });

  it('onMouseUp and onMouseOut should stop painting', () => {

    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    expect(service.onMouseOut(coordinate)).toEqual(['', '']);
    expect(service.onMouseUp(coordinate)).toEqual(['', '']);
    service.onMouseDown(coordinate);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 54, clientY: 54 });
    service.onMouseMovement(coordinate1);
    const coordinate2 = new MouseEvent('mouseup', { clientX: 54, clientY: 54 });
    service.onMouseUp(coordinate2);
    expect(service.selectionBox.dimensions[INDEX.X]).toEqual(0);
    expect(service.selectionBox.dimensions[INDEX.Y]).toEqual(0);

    const coordinate4 = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate4);
    const coordinate5 = new MouseEvent('mouseleave');
    service.onMouseOut(coordinate5);
    const coordinate6 = new MouseEvent('mousemove', { clientX: 52, clientY: 52 });
    service.onMouseMovement(coordinate6);
    expect(service.selectionBox.dimensions[INDEX.X]).toEqual(0);
    expect(service.selectionBox.dimensions[INDEX.Y]).toEqual(0);
  });

  it('onMouseMovement should change width and height if its painting', () => {
    const coordinate0 = new MouseEvent('mousemove', { clientX: 0, clientY: 54 });
    service.onMouseMovement(coordinate0);

    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 54, clientY: 54 });
    service.onMouseMovement(coordinate1);
    const coordinate2 = new MouseEvent('mousemove', { clientX: 60, clientY: 60 });
    service.onMouseMovement(coordinate2);
    const coordinate3 = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
    service.onMouseMovement(coordinate3);

    expect(service.selectionBox.dimensions[INDEX.X]).toEqual(50);
    expect(service.selectionBox.dimensions[INDEX.Y]).toEqual(50);
  });
  it('onMouseMovement doesnt give negative values to width and heigth', () => {

    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate);

    const coordinate3 = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    service.onMouseMovement(coordinate3);

    expect(service.selectionBox.dimensions[INDEX.X]).toEqual(50);
    expect(service.selectionBox.dimensions[INDEX.Y]).toEqual(50);
  });

  it('shiftDown creats a circle', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    expect(service.onShiftDown(coordinate)).toEqual(['', '']);
    service.onMouseDown(coordinate);
    const coordinate3 = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    service.onMouseMovement(coordinate3);
    const coordinate4 = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMovement(coordinate4);
    service.onShiftDown(coordinate3);
    const result: boolean = service.actualShape.dimensions[INDEX.X] === service.actualShape.dimensions[INDEX.Y];
    expect(result).toEqual(true);
  });
  it('shiftUp undo the  circle', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    expect(service.onShiftUp(coordinate)).toEqual(['', '']);
    service.onMouseDown(coordinate);
    const coordinate3 = new MouseEvent('mousemove', { clientX: 0, clientY: 20 });
    service.onMouseMovement(coordinate3);

    service.onShiftDown(coordinate3);
    const result: boolean = service.actualShape.dimensions[INDEX.X] === service.actualShape.dimensions[INDEX.Y];
    expect(result).toEqual(true);

    service.onShiftUp(coordinate3);
    const result2: boolean = service.actualShape.dimensions[INDEX.X] === service.actualShape.dimensions[INDEX.Y];
    expect(result2).toEqual(false);
  });

  it('tagReturner returns expected string and rotates the image acordingly', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate);
    const coordinate2 = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    service.attributes = [5, 'contour'];
    const result: [string, string] = service.onMouseMovement(coordinate2);
    const expectedResult1 = ['ellip0' ,
    '<g id="ellip0" x="0" y="0" width="50" height="50">' +
    '<rect  x="0" y="0" width="50" height="50" fill="none"" stroke="black" stroke-dasharray="25"/>' +
    '<ellipse  class="primary " cx="25" cy="25" rx="20" ry="20" stroke="#000000ff" stroke-width="0" fill="none"/>' +
    '<ellipse  class="secondary contour" cx="25" cy="25" rx="22.5" ry="22.5" stroke="#000000ff" stroke-width="5" fill="none"/>' +
    '</g>'];
    expect(result).toEqual(expectedResult1); // si bordure est correcte et on de type contour

    const coordinate3 = new MouseEvent('mousedown', { clientX: 100, clientY: 0 });
    service.onMouseDown(coordinate3);
    const coordinate4 = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.attributes = [25, 'fill'];
    const result2: [string, string] = service.onMouseMovement(coordinate4);
    const expectedResult2 = ['ellip0' ,
    '<g id="ellip0" x="50" y="0" width="50" height="50"><rect  x="50" y="0" width="50"' +
    ' height="50" fill="none"" stroke="black" stroke-dasharray="25"/><ellipse ' +
    ' class="primary fill" cx="75" cy="25" rx="25" ry="25" stroke="#000000ff"' +
    ' stroke-width="0" fill="#000000ff"/><ellipse  class="secondary contour"' +
    ' cx="75" cy="25" rx="25" ry="25" stroke="#000000ff" stroke-width="0" fill="none"/></g>'];

    expect(result2).toEqual(expectedResult2); // type fill et la bordure inferieure au width ou heigth

    const coordinate5 = new MouseEvent('mousedown', { clientX: 0, clientY: 100 });
    service.onMouseDown(coordinate5);
    const coordinate6 = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.attributes = [60, ''];
    const result3: [string, string] = service.onMouseMovement(coordinate6);
    const expectedResult3 = ['ellip0' ,
    '<g id="ellip0" x="0" y="50" width="50" height="50"><rect  x="0" y="50"' +
    ' width="50" height="50" fill="none"" stroke="black" stroke-dasharray="25"/>' +
    '<ellipse  class="secondary fill" cx="25" cy="75" rx="25" ry="25" stroke-width="0" fill="#000000ff"/></g>'];
    expect(result3).toEqual(expectedResult3); // test la bordure plus grande que les width ou heigth
  });

  it('onEscape should call tagReturner', () => {
    let result: [string, string] = service.onEscape();
    expect(result).toEqual(['', '']);
    // tslint:disable-next-line:no-string-literal
    service['interruptors'] = new Map([['isPainting', true],
    ['isShiftDown', false],
    ['mouseUp', false]]);
    const expectedResult: [string, string] = ['ellip0',
    '<g id="ellip0" x="0" y="0" width="0" height="0"><rect' +
    '  x="0" y="0" width="0" height="0" fill="none"" stroke="black"' +
    ' stroke-dasharray="25"/><ellipse  class="secondary fill" cx="0" cy="0"' +
    ' rx="0" ry="0" stroke-width="0" fill="#000000ff"/></g>'];
    result = service.onEscape();
    expect(result).toEqual(expectedResult);
  });

  it('onBackspace should call tagReturner', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    let result: [string, string] = service.onBackspace(coordinate);
    expect(result).toEqual(['', '']);
    // tslint:disable-next-line:no-string-literal
    service['interruptors'] = new Map([['isPainting', true],
                                    ['isShiftDown', false],
                                    ['mouseUp', false]]);
    const expectedResult: [string, string] = ['ellip0',
    '<g id="ellip0" x="0" y="0" width="0" height="0"><rect' +
    '  x="0" y="0" width="0" height="0" fill="none"" stroke="black"' +
    ' stroke-dasharray="25"/><ellipse  class="secondary fill" cx="0" cy="0"' +
    ' rx="0" ry="0" stroke-width="0" fill="#000000ff"/></g>'];
    result = service.onBackspace(coordinate);
    expect(result).toEqual(expectedResult);
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
  it('setCurrentId sets the id', () => {
    service.setCurrentId(345098435);
    expect(service.getCurrentId()).toBe(345098435);
  });

  it('controle key does nothing', () => {
    expect(service.onCtrlKey(new KeyboardEvent('keypress', { key: 'l' }))).toEqual(['', '']);
  });

  it('onSelected does nothing', () => {
    const res = service.onSelected();
    expect(res).toEqual(undefined);
  });

});
