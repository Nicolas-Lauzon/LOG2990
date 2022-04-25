/* tslint:disable:no-magic-numbers */
// tslint:disable: no-string-literal

import { TestBed } from '@angular/core/testing';

import { DataService } from '../data-service/data.service';
import { GridService } from './grid.service';

describe('GridService', () => {
  let service: GridService;
  let grid: HTMLElement;
  let svg: SVGSVGElement;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [DataService]
  }));

  beforeEach(() => {
    service = TestBed.inject(GridService);

    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'svg');
    document.body.appendChild(svg);

    grid = document.createElement('grid');
    grid.setAttribute('id', 'grid');
    svg.appendChild(grid);

    service['drawing'].svg = svg;

  });

  it('should be created', () => {
    service = TestBed.inject(GridService);
    expect(service).toBeTruthy();
  });

  it('makeGrid should create a string containing the grid', () => {
    service.size = 10;
    service['width'] = 30;
    service['height'] = 30;

    expect(service['makeGrid']()).toEqual("<line x1=0 y1 ='0' x2 = '0' y2 = '30' style = 'stroke:black; stroke-opacity:0.1' />\n" +
    "<line x1=10 y1 ='0' x2 = '10' y2 = '30' style = 'stroke:black; stroke-opacity:0.1' />\n" +
    "<line x1=20 y1 ='0' x2 = '20' y2 = '30' style = 'stroke:black; stroke-opacity:0.1' />\n" +
    "<line x1=0 y1 ='0' x2 = '30' y2 = '0' style = 'stroke:black; stroke-opacity:0.1' />\n" +
    "<line x1=0 y1 ='10' x2 = '30' y2 = '10' style = 'stroke:black; stroke-opacity:0.1' />\n" +
    "<line x1=0 y1 ='20' x2 = '30' y2 = '20' style = 'stroke:black; stroke-opacity:0.1' />\n");
  });

  it('ActivateGrid should set isActive to true and call makeGrid', () => {
    const spy = spyOn(service, 'makeGrid' as never);
    service.size = 10;

    service.activateGrid();
    expect(service.isActive).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('showGrid should set the innerHTML to the right string', async () => {

    service.size = 10;
    service['width'] = 30;
    service['height'] = 30;

    service.activateGrid();
    service.showGrid();
    await new Promise((done) => setTimeout(() => done(), 50));
    expect(grid.innerHTML).toEqual(
      '<line x1="0" y1="0" x2="0" y2="30" style="stroke:black; stroke-opacity:0.1">\n' +
        '<line x1="10" y1="0" x2="10" y2="30" style="stroke:black; stroke-opacity:0.1">\n' +
          '<line x1="20" y1="0" x2="20" y2="30" style="stroke:black; stroke-opacity:0.1">\n' +
            '<line x1="0" y1="0" x2="30" y2="0" style="stroke:black; stroke-opacity:0.1">\n' +
              '<line x1="0" y1="10" x2="30" y2="10" style="stroke:black; stroke-opacity:0.1">\n' +
                '<line x1="0" y1="20" x2="30" y2="20" style="stroke:black; stroke-opacity:0.1">\n' +
                  '</line></line></line></line></line></line>');
  });

  it('increaseSize should increase the size by 5', () => {
    service.size = 10;

    service.increaseSize();

    expect(service.size).toEqual(15);
  });

  it('decreaseSize should decrease the size by 5', () => {
    service.size = 10;

    service.decreaseSize();

    expect(service.size).toEqual(5);
  });
});
