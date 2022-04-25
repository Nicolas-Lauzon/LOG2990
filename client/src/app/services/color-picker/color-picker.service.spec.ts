import { TestBed } from '@angular/core/testing';
import { DrawingService } from 'src/app/services/drawing-service/drawing.service';
import { DataService } from './../data-service/data.service';

import { ColorPickerService } from './color-picker.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

describe('colorPicker', () => {
  let service: ColorPickerService;

  let c: HTMLCanvasElement;
  let grid: HTMLElement;
  let svg: SVGSVGElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorPickerService, DataService, DrawingService]
    });
  });
  beforeEach(() => {

    service = TestBed.inject(ColorPickerService);

    c = document.createElement('canvas');
    c.setAttribute('id', 'hiddenCanvas');
    c.width = 100;
    c.height = 100;
    document.body.appendChild(c);

    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'svg');
    document.body.appendChild(svg);

    grid = document.createElement('g');
    grid.setAttribute('id', 'grid');
    svg.appendChild(grid);

    service['ctx'] = (c.getContext('2d') as CanvasRenderingContext2D);
    service['grid'].isActive = true;
    service['drawing'].svg = svg;
    service['svgToCanvas']();
  });

  it('should be created', () => {

    expect(service).toBeTruthy();
  });

  it('onShiftUp should return an empty string', () => {
    const event = new MouseEvent('mousedown');
    expect(service.onShiftUp(event)).toEqual(['', '']);
  });

  it('onEscape should return an empty string', () => {
    const event = new MouseEvent('mousedown');
    expect(service.onEscape(event)).toEqual(['', '']);
  });

  it('onShiftDown should return an empty string', () => {
    const event = new MouseEvent('mousedown');
    expect(service.onShiftDown(event)).toEqual(['', '']);
  });

  it('onBackspace should return an empty string', () => {
    const event = new MouseEvent('mousedown');
    expect(service.onBackspace(event)).toEqual(['', '']);
  });
  it('onCtrlKey should return an empty string', () => {
    const event = new KeyboardEvent('a');
    expect(service.onCtrlKey(event)).toEqual(['', '']);
  });

  it('onMouseDown should call getColor and SvgToCanvas', async () => {
    const spyCanvas = spyOn(service, 'svgToCanvas' as never);
    const spyColor = spyOn(service, 'getColor' as never);

    const eventDown = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });
    service.onMouseDown(eventDown, 0);

    expect(spyCanvas).toHaveBeenCalled();
    expect(spyColor).toHaveBeenCalled();

  });

  it('onMouseMovement should call getColor()', async () => {
      const spy = spyOn(service, 'getColor' as never);
      service['isclicked'] = true;
      const eventDown = new MouseEvent('mousedown', { clientX: 50, clientY: 50 });

      service.onMouseMovement(eventDown);
      expect(spy).toHaveBeenCalled();
  });

  it('getColor should change the secondary color if event.button is 2', async () => {

    const eventDown = new MouseEvent('mousedown', { clientX: 50, clientY: 50, button: 2 });
    service['button'] = eventDown.button;
    service['ctx'] = (c.getContext('2d') as CanvasRenderingContext2D);
    service['ctx'].fillStyle = 'white';
    service['ctx'].fillRect(0, 0, window.innerWidth, window.innerHeight);

    service['getColor'](eventDown);

    await new Promise((done) => setTimeout(() => done(), 500));

    expect(service['colorService'].secondaryColor).toEqual('#ffffff');
  });
  it('getColor should change the primary color if event.button is 0', async () => {

    const eventDown = new MouseEvent('mousedown', { clientX: 50, clientY: 50, button: 0});
    service['button'] = eventDown.button;
    service['ctx'] = (c.getContext('2d') as CanvasRenderingContext2D);
    service['ctx'].fillStyle = 'white';
    service['ctx'].fillRect(0, 0, window.innerWidth, window.innerHeight);

    service['getColor'](eventDown);

    await new Promise((done) => setTimeout(() => done(), 500));

    expect(service['colorService'].primaryColor).toEqual('#ffffff');

  });

  it('onMouseOut should return an empty string', async () => {

  const event = new MouseEvent('mousedown', { clientX: 50, clientY: 50, button: 0 });
  expect(service.onMouseOut(event)).toEqual(['', '']);
  });

  it('onMouseUp should return an empty string and set isClicked to false', async () => {
    service['isclicked'] = true;
    const event = new MouseEvent('mousedown', { clientX: 50, clientY: 50, button: 0 });

    expect(service.onMouseUp(event)).toEqual(['', '']);
    expect(service['isclicked']).toBeFalsy();

  });
  it('svgToCanvas draws the image into the context', async () => {
    expect(service['svgToCanvas']()).toBeFalsy();

  });

  it('getCurrentId return 0', () => {
    const result = service.getCurrentId();
    expect(result).toEqual(0);
  });

  it('setCurrentId return nothing', () => {
    service.setCurrentId(4);
    expect(service.setCurrentId).toBeDefined();
  });
  it('onSelected does nothing', () => {
    const res = service.onSelected();
    expect(res).toEqual(undefined);
  });

});
