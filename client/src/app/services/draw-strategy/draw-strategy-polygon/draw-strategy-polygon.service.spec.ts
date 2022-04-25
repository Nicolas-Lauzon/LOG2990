/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
import { TestBed } from '@angular/core/testing';
import { DataService } from '../../data-service/data.service';
import { DrawStrategyPolygonService } from './draw-strategy-polygon.service';

describe('Service: DrawStrategyPolygon', () => {
  let service: DrawStrategyPolygonService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawStrategyPolygonService, DataService]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DrawStrategyPolygonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.type).toEqual('');
    expect(service.polygonParams.attributes[1]).toBe(1);
    expect(service.polygonParams.points[1]).toEqual('');
    expect(service.polygonParams.points[0]).toEqual('');
  });

  it('onMouseDown should start painting', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate);
    expect(service.mouseStatus[0]).toBe(true);
    expect(service.polygonParams.positions[0]).toEqual(50);
    expect(service.polygonParams.positions[1]).toEqual(50);
  });

  it('onMouseUp should stop painting', () => {

    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    expect(service.onMouseOut(coordinate)).toEqual(['', '']);
    expect(service.onMouseUp(coordinate)).toEqual(['', '']);
    service.onMouseDown(coordinate);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 54, clientY: 54 });
    service.onMouseMovement(coordinate1);
    const coordinate2 = new MouseEvent('mouseup', { clientX: 54, clientY: 54 });
    service.onMouseUp(coordinate2);

    expect(service.mouseStatus[0]).toBe(false);
    expect(service.polygonParams.rectangleDimensions[0]).toEqual(0);
    expect(service.polygonParams.rectangleDimensions[1]).toEqual(0);

    const coordinate4 = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate4);
    const coordinate5 = new MouseEvent('mouseleave');
    service.onMouseOut(coordinate5);
    const coordinate6 = new MouseEvent('mousemove', { clientX: 52, clientY: 52 });
    service.onMouseMovement(coordinate6);
    expect(service.mouseStatus[0]).toBe(false);
    expect(service.polygonParams.rectangleDimensions[0]).toEqual(0);
    expect(service.polygonParams.rectangleDimensions[1]).toEqual(0);

  });

  it('onMouseMovement should return nothing if not painting', () => {
    const coordinate = new MouseEvent('mousemove', { clientX: 20, clientY: 20 });
    expect(service.onMouseMovement(coordinate)).toEqual(['', '']);
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

    expect(service.polygonParams.rectangleDimensions[0]).toEqual(50);
    expect(service.polygonParams.rectangleDimensions[1]).toEqual(50);
  });

  it('onMouseMovement doesnt give negative values to width and heigth', () => {

    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate);

    const coordinate3 = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    service.onMouseMovement(coordinate3);

    expect(service.polygonParams.rectangleDimensions[0]).toEqual(50);
    expect(service.polygonParams.rectangleDimensions[1]).toEqual(50);
  });

  it('onMouseMovement transforms correctly the outer Rectangle', () => {

    const coordinate = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(coordinate);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
    service.onMouseMovement(coordinate1);
    expect(service.transform).toEqual(180);

    const coordinate2 = new MouseEvent('mousemove', { clientX: 100, clientY: 0 });
    service.onMouseMovement(coordinate2);
    expect(service.transform).toEqual(270);

    const coordinate3 = new MouseEvent('mousemove', { clientX: 0, clientY: 50 });
    service.onMouseMovement(coordinate3);
    expect(service.transform).toEqual(90);
  });

  it('onMouseMovement returns the right radius for 3 sides polygon width y as shortest side and strokeWidth is 0', () => {
    service.polygonParams.attributes[0] = 3;
    service.polygonParams.attributes[1] = 0;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 50, clientY: 20 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(13.33333333333307);
    expect(service.polygonParams.radius[1]).toEqual(13.33333333333307);
  });

  it('onMouseMovement returns the right radius for 3 sides polygon width y as shortest side and strokeWidth is 10', () => {
    service.polygonParams.attributes[0] = 3;
    service.polygonParams.attributes[1] = 10;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 50, clientY: 40 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(16.666666666666735);
    expect(service.polygonParams.radius[1]).toEqual(6.666666666667332);
  });

  it('onMouseMovement returns the right radius for 3 sides polygon width x as shortest side and strokeWidth is 0', () => {
    service.polygonParams.attributes[0] = 3;
    service.polygonParams.attributes[1] = 0;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 40, clientY: 100 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(23.094010767591);
    expect(service.polygonParams.radius[1]).toEqual(23.094010767591);
  });

  it('onMouseMovement returns the right radius for 3 sides polygon width x as shortest side and strokeWidth is 10', () => {
    service.polygonParams.attributes[0] = 3;
    service.polygonParams.attributes[1] = 10;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 40, clientY: 100 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(13.094010767591598);
    expect(service.polygonParams.radius[1]).toEqual(3.094010767592195);
  });

  it('onMouseMovement returns the right radius for 6 sides polygon width y as shortest side and strokeWidth is 0', () => {
    service.polygonParams.attributes[0] = 6;
    service.polygonParams.attributes[1] = 0;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 50, clientY: 20 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(10);
    expect(service.polygonParams.radius[1]).toEqual(10);
  });

  it('onMouseMovement returns the right radius for 6 sides polygon width y as shortest side and strokeWidth is 10', () => {
    service.polygonParams.attributes[0] = 6;
    service.polygonParams.attributes[1] = 10;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 50, clientY: 40 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(14.226497308103973);
    expect(service.polygonParams.radius[1]).toEqual(8.452994616207945);
  });

  it('onMouseMovement returns the right radius for 6 sides polygon width x as shortest side and strokeWidth is 0', () => {
    service.polygonParams.attributes[0] = 6;
    service.polygonParams.attributes[1] = 0;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 40, clientY: 100 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(23.09401076757998);
    expect(service.polygonParams.radius[1]).toEqual(23.09401076757998);
  });

  it('onMouseMovement returns the right radius for 6 sides polygon width x as shortest side and strokeWidth is 10', () => {
    service.polygonParams.attributes[0] = 6;
    service.polygonParams.attributes[1] = 10;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 40, clientY: 100 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(17.320508075683954);
    expect(service.polygonParams.radius[1]).toEqual(11.547005383787926);
  });

  it('onMouseMovement returns the right radius if width and height are too small for strokeWidth', () => {
    service.polygonParams.attributes[0] = 3;
    service.polygonParams.attributes[1] = 50;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 20, clientY: 20 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(0);
    expect(service.polygonParams.radius[1]).toEqual(11.5470053837955);
    expect(service.polygonParams.inverseColors).toBeTruthy();
  });

  it('onMouseMovement returns the right radius for type=fill', () => {
    service.polygonParams.attributes[0] = 3;
    service.polygonParams.attributes[1] = 50;
    service.type = 'fill';
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 20, clientY: 20 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(0);
    expect(service.polygonParams.radius[1]).toEqual(11.5470053837955);
    expect(service.polygonParams.inverseColors).toBeFalsy();
  });

  it('onMouseMovement returns the right radius for type=contour with enough space for empty center', () => {
    service.polygonParams.attributes[0] = 3;
    service.polygonParams.attributes[1] = 20;
    service.type = 'contour';
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(37.7350269189787);
    expect(service.polygonParams.radius[1]).toEqual(0);
    expect(service.polygonParams.inverseColors).toBeFalsy();

    service.polygonParams.attributes[0] = 6;
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(38.452994616207945);
    expect(service.polygonParams.radius[1]).toEqual(0);
    expect(service.polygonParams.inverseColors).toBeFalsy();
  });

  it('onMouseMovement returns the right radius for type=empty with enough space for empty center', () => {
    service.polygonParams.attributes[0] = 3;
    service.polygonParams.attributes[1] = 20;
    service.type = '';
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 100, clientY: 100 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(37.7350269189787);
    expect(service.polygonParams.radius[1]).toEqual(17.73502691897989);
    expect(service.polygonParams.inverseColors).toBeFalsy();

    service.polygonParams.attributes[0] = 6;
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(38.452994616207945);
    expect(service.polygonParams.radius[1]).toEqual(26.90598923241589);
    expect(service.polygonParams.inverseColors).toBeFalsy();
  });

  it('onMouseMovement returns the right radius for type=contour without enough space for empty center', () => {
    service.polygonParams.attributes[0] = 3;
    service.polygonParams.attributes[1] = 50;
    service.type = 'contour';
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onMouseDown(coordinate0);
    const coordinate1 = new MouseEvent('mousemove', { clientX: 20, clientY: 20 });
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(0);
    expect(service.polygonParams.radius[1]).toEqual(11.5470053837955);
    expect(service.polygonParams.inverseColors).toBeTruthy();

    service.polygonParams.attributes[0] = 6;
    service.onMouseMovement(coordinate1);
    expect(service.polygonParams.radius[0]).toEqual(0);
    expect(service.polygonParams.radius[1]).toEqual(10);
    expect(service.polygonParams.inverseColors).toBeTruthy();
  });

  it('onBackSpace should call tagReturner', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    const result: [string, string] = service.onBackspace(coordinate);
    expect(result).toEqual(['', '']);
    spyOn(service, 'tagReturner');
    service.mouseStatus[0] = true;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onBackspace(coordinate0);
    expect(service.tagReturner).toHaveBeenCalled();
  });

  it('onEscape should call tagReturner', () => {
    const result: [string, string] = service.onEscape();
    expect(result).toEqual(['', '']);
    spyOn(service, 'tagReturner');
    service.mouseStatus[0] = true;
    service.onEscape();
    expect(service.tagReturner).toHaveBeenCalled();
  });

  it('onShiftDown should call onMouseMovement', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    const result: [string, string] = service.onShiftDown(coordinate);
    expect(result).toEqual(['', '']);
    spyOn(service, 'onMouseMovement');
    service.mouseStatus[0] = true;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onShiftDown(coordinate0);
    expect(service.onMouseMovement).toHaveBeenCalledTimes(1);
  });

  it('onShiftUp should call onMouseMovement', () => {
    const coordinate = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    const result: [string, string] = service.onShiftUp(coordinate);
    expect(result).toEqual(['', '']);

    spyOn(service, 'onMouseMovement');
    service.mouseStatus[0] = true;
    const coordinate0 = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    service.onShiftUp(coordinate0);
    expect(service.onMouseMovement).toHaveBeenCalledTimes(1);
  });

  it('onCtrl should return nothing', () => {
    const lKey = new KeyboardEvent('keypress', { key: 'l' });
    const test: string[] = service.onCtrlKey(lKey);
    expect(test).toEqual(['', '']);
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
  it('onSelected does nothing', () => {
    const res = service.onSelected();
    expect(res).toEqual(undefined);
  });
});
