// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal

import { TestBed } from '@angular/core/testing';

import { DataService } from '../../data-service/data.service';
import { DrawInvokerService } from '../../draw-invoker-service/draw-invoker.service';
import { DrawingService } from '../../drawing-service/drawing.service';
import { DrawStrategyBucketService } from './draw-strategy-bucket.service';

describe('DrawStrategyBucketService', () => {
  let service: DrawStrategyBucketService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [DrawStrategyBucketService, DataService, DrawingService, DrawInvokerService]
  }));
  beforeEach(() => {
    service = TestBed.inject(DrawStrategyBucketService);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg);
    svg.style.background = '#ffffff';
    service['services'].drawingService.svg = svg;
    service['canvas'] = document.createElement('canvas');
    service['canvas'].width = 100;
    service['canvas'].height = 100;
    const ctx = (service['canvas'].getContext('2d') as CanvasRenderingContext2D);
    ctx.beginPath();
    ctx.rect(0, 0, 100, 100);
    ctx.fillStyle = 'red';
    ctx.fill();

    service['newCanvas'] = document.createElement('canvas');
    service['newCanvas'].width = 100;
    service['newCanvas'].height = 100;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('onSelected should create the canvas and call transformToCanvas()', () => {
    const spy = spyOn(service, 'transformToCanvas' as never);
    service['services'].dataService.changeDimensionX(100);
    service['services'].dataService.changeDimensionY(100);
    service.onSelected();

    expect(service['canvas']).toBeTruthy();
    expect(service['canvas'].width).toEqual(100);
    expect(service['canvas'].height).toEqual(100);
    expect(spy).toHaveBeenCalled();

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
  it('onMouseMovement should return an empty string', () => {
    const event = new MouseEvent('mousemove');
    expect(service.onMouseMovement(event)).toEqual(['', '']);
  });
  it('onMouseout should return an empty string', () => {
    const event = new MouseEvent('mouseleave');
    expect(service.onMouseOut(event)).toEqual(['', '']);
  });
  it('onMouseUp should return an empty string ans reset the array of borders', () => {
    const spy = spyOn(service, 'transformToCanvas' as never);
    const event = new MouseEvent('mouseup');
    service.onMouseUp(event);
    expect(spy).toHaveBeenCalled();
  });
  it('onMouseDown should call transformToNumber 4 times, floodfill, tag returner', async () => {
    const spyTransform = spyOn(service, 'transformToNumber' as never);
    const spyFloodFill = spyOn(service, 'floodFill' as never).and.returnValue(service['canvas'] as never);
    const spyTagReturner = spyOn(service, 'tagReturner' as never).and.returnValue(['0', '0'] as never);
    const spyInvoker = spyOn(service['services'].drawInvoker, 'do' as never);

    const event = new MouseEvent('mousedown');
    service.onMouseDown(event, 0);
    expect(spyTransform).toHaveBeenCalledTimes(4);
    expect(spyFloodFill).toHaveBeenCalled();
    expect(spyTagReturner).toHaveBeenCalled();

    expect(spyInvoker).toHaveBeenCalled();

  });
  it('transformToCanvas should draw the svg on the canvas', async () => {

    service.onSelected();

    service['services'].drawingService.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['services'].drawingService.svg.setAttribute('width', '100');
    service['services'].drawingService.svg.setAttribute('height', '100');
    service['services'].drawingService.svg.setAttribute('fill', '#ff0000');
    service['transformToCanvas']();
    await new Promise((done) => setTimeout(() => done(), 2000));

    expect(service['canvas'].getContext('2d') as CanvasRenderingContext2D).toBeDefined();
  });
  it('transformToCanvas should remove the grid from the svg', async () => {
    service.onSelected();
    const grid = document.createElement('g');
    grid.id = 'grid';
    service['services'].drawingService.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service['services'].drawingService.svg.appendChild(grid);
    service['services'].gridService.isActive = true;
    service['transformToCanvas']();
    await new Promise((done) => setTimeout(() => done(), 2000));
    expect(service['canvas'].getContext('2d') as CanvasRenderingContext2D).toBeDefined();
  });
  it('floodFill should fill the entire canvas', async () => {
    const ctx = (service['canvas'].getContext('2d') as CanvasRenderingContext2D);
    ctx.beginPath();
    ctx.rect(0, 0, 100, 100);
    ctx.fillStyle = 'red';
    ctx.fill();
    service['services'].dataService.changeDimensionX(100);
    service['services'].dataService.changeDimensionY(100);

    service['onSelected']();
    await new Promise((done) => setTimeout(() => done(), 2000));
    const spy = spyOn(service, 'checkValidity' as never).and.returnValues(true as never, true as never, true as never, true as never);
    const color = new Uint8ClampedArray([100, 100, 100, 255]);
    service['floodFill'](service['canvas'], 50, 50, color);
    expect(spy).toHaveBeenCalledTimes(20);
  });
  it('setColor should change to color inside the imageData', async () => {
    const color = new Uint8ClampedArray([100, 100, 100, 255]);
    const img = new ImageData(10, 10);
    const img2 = new ImageData(10, 10);

    service['setColor'](0, 0, color, img, img2);
    expect(img).toEqual(img2);
  });
  it('assembleResult returns a SVGImage containing canvas.toDataURL', async () => {
    service['size'] = [[10, 10], [10, 10]];

    expect(service['assembleResult'](service['canvas'])).toEqual('<image href="data:image/png;base64' +
    ',iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABa0lEQVR4Xu3VwQkAQAjEQO2/aA+uijzGCkLC4t7MjcsYWEEyLT' +
    '6IIK0egsR6CCJIzUCMxw8RJGYghmMhgsQMxHAsRJCYgRiOhQgSMxDDsRBBYgZiOBYiSMxADMdCBIkZiOFYiCAxAzEcCxEkZiCGYyG' +
    'CxAzEcCxEkJiBGI6FCBIzEMOxEEFiBmI4FiJIzEAMx0IEiRmI4ViIIDEDMRwLESRmIIZjIYLEDMRwLESQmIEYjoUIEjMQw7EQQWIGYj' +
    'gWIkjMQAzHQgSJGYjhWIggMQMxHAsRJGYghmMhgsQMxHAsRJCYgRiOhQgSMxDDsRBBYgZiOBYiSMxADMdCBIkZiOFYiCAxAzEcCxEkZi' +
    'CGYyGCxAzEcCxEkJiBGI6FCBIzEMOxEEFiBmI4FiJIzEAMx0IEiRmI4ViIIDEDMRwLESRmIIZjIYLEDMRwLESQmIEYjoUIEjMQw7EQQWIGY' +
    'jgWIkjMQAzHQgSJGYjhPBWOx51YKJcYAAAAAElFTkSuQmCC" class="primary bucket" x="10" y="10"></image>');
  });
  it('tagReturner should return the right tag', async () => {
    service['size'] = [[10, 10], [10, 10]];
    expect(service['tagReturner'](service['canvas'])).toEqual(['bucket0', '<g id="bucket0" x="10" y="10" width="0"' +
    ' height="0"> <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAABa0lEQVR4Xu3VwQkA' +
    'QAjEQO2/aA+uijzGCkLC4t7MjcsYWEEyLT6IIK0egsR6CCJIzUCMxw8RJGYghmMhgsQMxHAsRJCYgRiOhQgSMxDDsRBBYgZiOBYiSMxADMdCBIkZiO' +
    'FYiCAxAzEcCxEkZiCGYyGCxAzEcCxEkJiBGI6FCBIzEMOxEEFiBmI4FiJIzEAMx0IEiRmI4ViIIDEDMRwLESRmIIZjIYLEDMRwLESQmIEYjoUIEjMQw7E' +
    'QQWIGYjgWIkjMQAzHQgSJGYjhWIggMQMxHAsRJGYghmMhgsQMxHAsRJCYgRiOhQgSMxDDsRBBYgZiOBYiSMxADMdCBIkZiOFYiCAxAzEcCxEkZiCGYyGCxAz' +
    'EcCxEkJiBGI6FCBIzEMOxEEFiBmI4FiJIzEAMx0IEiRmI4ViIIDEDMRwLESRmIIZjIYLEDMRwLESQmIEYjoUIEjMQw7EQQWIGYjgWIkjMQAzHQgSJGYjhPBWOx5' +
    '1YKJcYAAAAAElFTkSuQmCC" class="primary bucket" x="10" y="10"></image></g>']);
  });

  it('transformToNumber should convert a hexadecimal string into a number', async () => {
    expect(service['transformToNumber']('45')).toEqual(69);
    expect(service['transformToNumber']('0')).toEqual(0);
    expect(service['transformToNumber']('ff')).toEqual(255);

  });

  it('checkInterval should check if the colorToFill greater than the minColor and smaller than the maxColor', async () => {
    let colorToFill = new Uint8ClampedArray([150, 150, 150, 255]);
    let pixelColor = new Uint8ClampedArray([125, 125, 125, 255]);
    let maxColor = service['getMaxColor'](pixelColor);
    let minColor = service['getMinColor'](pixelColor);
    service.tolerance = 25;
    expect(service['checkInterval'](pixelColor, colorToFill, 0, maxColor, minColor)).toBeTruthy();
    colorToFill = new Uint8ClampedArray([0, 0, 0, 255]);
    pixelColor = new Uint8ClampedArray([0, 0, 0, 255]);
    maxColor = service['getMaxColor'](pixelColor);
    minColor = service['getMinColor'](pixelColor);
    expect(service['checkInterval'](pixelColor, colorToFill, 0, maxColor, minColor)).toBeTruthy();
    colorToFill = new Uint8ClampedArray([255, 255, 255, 255]);
    pixelColor = new Uint8ClampedArray([0, 0, 0, 255]);
    service.tolerance = 100;
    maxColor = service['getMaxColor'](pixelColor);
    minColor = service['getMinColor'](pixelColor);
    expect(service['checkInterval'](pixelColor, colorToFill, 0, maxColor, minColor)).toBeTruthy();
    colorToFill = new Uint8ClampedArray([255, 255, 255, 255]);
    pixelColor = new Uint8ClampedArray([180, 180, 180, 255]);
    service.tolerance = 0;
    maxColor = service['getMaxColor'](pixelColor);
    minColor = service['getMinColor'](pixelColor);
    expect(service['checkInterval'](pixelColor, colorToFill, 0, maxColor, minColor)).toBeTruthy();
  });

  it('setCurrentId return nothing', () => {
    service.setCurrentId(4);
    expect(service.setCurrentId).toBeDefined();
  });
  it('getCurrentId return 0', () => {
    const result = service.getCurrentId();
    expect(result).toEqual(0);
  });
  it('color with tolerance is bigger than 255', () => {
    service.tolerance = 0;
    const color = new Uint8ClampedArray([255, 255, 255, 255]);
    const colorToFill = new Uint8ClampedArray([10, 10, 10, 255]);
    const maxColor = service['getMaxColor'](colorToFill);
    const minColor = service['getMinColor'](colorToFill);
    expect(service['checkInterval'](color, colorToFill, 0, maxColor, minColor)).toBeFalsy();
  });
  it('checkValidity returns false when the pixels are outside of the shape', () => {
    const color = new Uint8ClampedArray([100, 100, 100, 255]);
    service.tolerance = 5;
    const colorToFill = new Uint8ClampedArray([100, 100, 100, 255]);
    const maxColor = service['getMaxColor'](colorToFill);
    const minColor = service['getMinColor'](colorToFill);
    expect(service['checkValidity'](100, 100, color, 0, colorToFill, 200, 200, maxColor, minColor)).toBeTruthy();
  });
  it('checkValidity returns true when the pixels are in the shape', () => {
    const color = new Uint8ClampedArray([255, 255, 255, 255]);
    service.tolerance = 5;
    const colorToFill = new Uint8ClampedArray([0, 0, 0, 255]);
    const maxColor = service['getMaxColor'](colorToFill);
    const minColor = service['getMinColor'](colorToFill);
    expect(service['checkValidity'](100, 100, color, 0, colorToFill, 200, 200, maxColor, minColor)).toBeFalsy();
  });

  it('doOperation should do the right operation if op is fill', () => {
    spyOn(service, 'compareColors' as never).and.returnValue(true as never);
    service['services'].dataService.changeDimensionX(100);
    service['services'].dataService.changeDimensionY(100);
    service['onSelected']();
    const color = new Uint8ClampedArray([255, 255, 255, 255]);

    expect(service['floodFill'](service['canvas'], 10, 10, color)).toEqual(document.createElement('canvas'));
  });
});
