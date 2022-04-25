/* tslint:disable:no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { DataService } from '../../data-service/data.service';
import { DrawStrategyLineService, IS_USED } from './draw-strategy-line.service';

describe('Service: DrawStrategyLine', () => {
  let service: DrawStrategyLineService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawStrategyLineService, DataService]
    });
  });
  beforeEach(() => {
    service = TestBed.inject(DrawStrategyLineService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('#onMouseDown and mouseMovement ', async () => {
    const click: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });

    const click2: MouseEvent = new MouseEvent('mousemove', { clientX: 60, clientY: 60 });
    service.onMouseDown(click);
    await new Promise((done) => setTimeout(() => done(), 1000));
    const result = service.onMouseMovement(click2);
    const str = click.offsetX + ', ' + click.offsetY + ', ' + click2.offsetX + ', ' + click2.offsetY;
    const expectedResult = ['line0',
     '<g id="line0" x="45" y="45" class="other" width="20" height="20">' +
                                     '<polyline points=" ' + str + '" class="primary contour"' +
                                     ' stroke="#000000ff" stroke-width="5" fill="none"/>' +
                                     '<circle cx="50" class="secondary fill" cy="50" r="5" fill="#000000ff"/>' +
                                     '<circle cx="60" class="secondary fill" cy="60" r="5" fill="#000000ff"/>'];
    expect(result).toEqual(expectedResult);

  });

  it('#pressing shift gives a point at 45 degrees', async () => {
    const cl: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    expect(service.onShiftDown(cl)).toEqual(['', '']);
    expect(service.onShiftUp(cl)).toEqual(['', '']);

    const testingPoints: [number, number][] = new Array<[number, number]>(
      [110, 50],
      [140, 50],
      [150, 90],
      [150, 140],

      [110, 150],
      [60, 150],
      [50, 90],
      [60, 50],

    );
    const rightPoints: [number, number][] = new Array<[number, number]>(
      [100, 50],
      [140, 60],
      [150, 100],
      [150, 150],
      [100, 150],
      [60, 140],
      [50, 100],
      [60, 60],
    );
    for (let i = 0; i < testingPoints.length; i++) {
      const click: MouseEvent = new MouseEvent('mousedown', { clientX: 100, clientY: 100 });
      const click2: MouseEvent = new MouseEvent('mousemove', { clientX: testingPoints[i][0], clientY: testingPoints[i][1] });

      service.onMouseDown(click);
      await new Promise((done) => setTimeout(() => done(), 300));

      const result = service.onShiftDown(click2);

      const str = click.offsetX + ', ' + click.offsetY + ', ' + rightPoints[i][0] + ', ' + rightPoints[i][1];
      const expectedResult = ['line' + i, '<g id="line' + i + '" x="' + Math.min(100 - 5, rightPoints[i][0] - 5)  + '" y="' +
                                           Math.min(100 - 5, rightPoints[i][1] - 5)  + '" class="other" width="' +
                                           (Math.abs(100 - rightPoints[i][0]) + 10) +
                                           '" height="' + (Math.abs(100 - rightPoints[i][1]) + 10) + '">' +
                                          '<polyline points=" ' + str + '" class="primary contour" stroke="#000000ff"' +
                                          ' stroke-width="5" fill="none"/>' +
                                          '<circle cx="100" class="secondary fill" cy="100" r="5" fill="#000000ff"/>' +
                                          '<circle cx="' + rightPoints[i][0] + '" class="secondary fill"' +
                                          ' cy="' + rightPoints[i][1] + '" r="5" fill="#000000ff"/>'];
      expect(result).toEqual(expectedResult);

      // tslint:disable-next-line:no-string-literal
      service.onMouseDown(new MouseEvent('mousedown'));
      service.onMouseDown(new MouseEvent('mousedown'));
      service.onShiftUp(click);

      // tslint:disable-next-line:no-string-literal
      service['isUsed'][IS_USED.LINE] = true;
      // tslint:disable-next-line:no-string-literal
      service['isUsed'][IS_USED.SHIFT] = true;
      service.onShiftUp(click);
      // tslint:disable-next-line:no-string-literal
      expect(service['isUsed'][IS_USED.SHIFT]).toBeFalsy();
    }

  });

  it('backspace erases the last line ', async () => {
    const click: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    expect(service.onBackspace(click)).toEqual(['', '']);

    const click2: MouseEvent = new MouseEvent('mousedown', { clientX: 60, clientY: 60 });

    const click3: MouseEvent = new MouseEvent('mousedown', { clientX: 70, clientY: 70 });

    service.onMouseDown(click);
    await new Promise((done) => setTimeout(() => done(), 1000));

    service.onMouseDown(click2);

    await new Promise((done) => setTimeout(() => done(), 1000));

    const result = service.onBackspace(click3);
    const str = click.offsetX + ', ' + click.offsetY + ', ' + click3.offsetX + ', ' + click3.offsetY;
    const expectedResult = ['line0', '<g id="line0" x="45" y="45" class="other" width="30" height="30">' +
                                     '<polyline points=" ' + str + '" class="primary contour"' +
                                     ' stroke="#000000ff" stroke-width="5" fill="none"/>' +
                                     '<circle cx="50" class="secondary fill" cy="50" r="5" fill="#000000ff"/>' +
                                     '<circle cx="70" class="secondary fill" cy="70" r="5" fill="#000000ff"/>'];
    expect(result).toEqual(expectedResult);

  });

  it('escape erases the whole line ', async () => {
    const click: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    expect(service.onEscape(click)).toEqual(['', '']);

    const click2: MouseEvent = new MouseEvent('mousedown', { clientX: 60, clientY: 60 });

    const click3: MouseEvent = new MouseEvent('mousedown', { clientX: 70, clientY: 70 });

    service.onMouseDown(click);
    await new Promise((done) => setTimeout(() => done(), 1000));

    service.onMouseDown(click2);

    await new Promise((done) => setTimeout(() => done(), 1000));

    const result = service.onEscape(click3);
    const str = '';
    const expectedResult = ['line0', '<g id="line0" x="0" y="0" class="other" width="0" height="0">' +
                                     '<polyline points="' + str + '" class="primary contour"' +
                                     ' stroke="#000000ff" stroke-width="5" fill="none"/>'];
    expect(result).toEqual(expectedResult);

  });

  it('mouseUp add the point to the list', async () => {
    const click: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    expect(service.onMouseUp(click)).toEqual(['', '']);

    const click2: MouseEvent = new MouseEvent('mousedown', { clientX: 60, clientY: 60 });

    service.onMouseDown(click);
    await new Promise((done) => setTimeout(() => done(), 1000));

    const result = service.onMouseUp(click2);

    const str = click.offsetX + ', ' + click.offsetY + ', ' + click2.offsetX + ', ' + click2.offsetY;
    const expectedResult = ['line0', '<g id="line0" x="45" y="45" class="other" width="20" height="20">' +
                                     '<polyline points=" ' + str + '" class="primary contour"' +
                                     ' stroke="#000000ff" stroke-width="5" fill="none"/>' +
                                     '<circle cx="50" class="secondary fill" cy="50" r="5" fill="#000000ff"/>' +
                                     '<circle cx="60" class="secondary fill" cy="60" r="5" fill="#000000ff"/>'];
    expect(result).toEqual(expectedResult);

  });

  it('Doubleclick ends the line', async () => {
    const click: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    const click2: MouseEvent = new MouseEvent('mousedown', { clientX: 60, clientY: 60 });
    const click3: MouseEvent = new MouseEvent('mousemove', { clientX: 70, clientY: 70 });
    service.onMouseDown(click);
    await new Promise((done) => setTimeout(() => done(), 1000));
    service.onMouseDown(click2);
    await new Promise((done) => setTimeout(() => done(), 10));
    service.onMouseDown(click2);
    await new Promise((done) => setTimeout(() => done(), 1000));
    const result = service.onMouseMovement(click3);
    expect(result).toEqual(['', '']);

  });

  it('two points are less than 4px apart', async () => {
    const click1: MouseEvent = new MouseEvent('mousedown', { clientX: 51, clientY: 51 });
    const click2: MouseEvent = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    service.onMouseDown(click1);
    await new Promise((done) => setTimeout(() => done(), 2000));
    service.onMouseMovement(click2);

    service.onMouseDown(click2);
    await new Promise((done) => setTimeout(() => done(), 2000));
    const result = service.onMouseUp(click2);

    const expectedResult = ['line0', '<g id="line0" x="45" y="45" class="other" width="11" height="11">' +
                                     '<polyline points=" 51, 51, 50, 50, 50, 50"' +
                                     ' class="primary contour" stroke="#000000ff" stroke-width="5" fill="none"/>' +
                                     '<circle cx="51" class="secondary fill" cy="51" r="5" fill="#000000ff"/>' +
                                     '<circle cx="50" class="secondary fill" cy="50" r="5" fill="#000000ff"/>' +
                                     '<circle cx="50" class="secondary fill" cy="50" r="5" fill="#000000ff"/>'];
    expect(result).toEqual(expectedResult);

  });

  it(' Ignore the first click of a double click', async () => {
    const click1: MouseEvent = new MouseEvent('mousedown', { clientX: 51, clientY: 51 });
    const click2: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    spyOn(service, 'onMouseMovement');
    const value: [string, string] = service.onMouseDown(click1);
    service.onMouseDown(click2);
    await new Promise((done) => setTimeout(() => done(), 250));
    expect(value).toEqual(['', '']);
  });

  it('onMouseOut add the point to the list', async () => {
    const click: MouseEvent = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    expect(service.onMouseOut(click)).toEqual(['', '']);

    const click2: MouseEvent = new MouseEvent('mousedown', { clientX: 60, clientY: 60 });

    service.onMouseDown(click);
    await new Promise((done) => setTimeout(() => done(), 1000));

    const result = service.onMouseOut(click2);

    const str = click.offsetX + ', ' + click.offsetY + ', ' + click2.offsetX + ', ' + click2.offsetY;
    const expectedResult = ['line0', '<g id="line0" x="45" y="45" class="other" width="20" height="20">' +
                            '<polyline points=" ' + str + '" class="primary contour" stroke="#000000ff" stroke-width="5" fill="none"/>' +
                            '<circle cx="50" class="secondary fill" cy="50" r="5" fill="#000000ff"/>' +
                            '<circle cx="60" class="secondary fill" cy="60" r="5" fill="#000000ff"/>'];
    expect(result).toEqual(expectedResult);

  });
  it('controle key does nothing', () => {
    expect(service.onCtrlKey(new KeyboardEvent('keypress', { key: 'l' }))).toEqual(['', '']);
  });
  it('return id works', () => {
    expect(service.getCurrentId()).toBe(0);

  });
  it('set id works', () => {
    service.setCurrentId(5);
    expect(service.getCurrentId()).toBe(5);

  });

  it('calculate distance returns 0 if going to undifine', () => {
    // tslint:disable-next-line:no-any
    const to: any = undefined;
    const from: [number, number] = [0 , 0];
    // tslint:disable-next-line:no-string-literal
    expect(service['calculateDistance'](from, to)).toBe(0);
  });
});
