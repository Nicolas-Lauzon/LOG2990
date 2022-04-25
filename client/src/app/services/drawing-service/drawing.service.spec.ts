/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { DrawingService } from './drawing.service';

describe('Service: DrawingService', () => {
  let service: DrawingService;
  let testRect: HTMLElement;
  let selectedZone: HTMLElement;
  let drawZone: HTMLElement;
  let svg: HTMLElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawingService]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DrawingService);

    testRect = document.createElement('rect');
    testRect.id = 'rect0';
    testRect.setAttribute('x', '45');
    testRect.setAttribute('y', '300');
    testRect.setAttribute('width', '10');
    testRect.setAttribute('height', '10');

    drawZone = document.createElement('g');
    drawZone.id = 'drawZone';
    drawZone.setAttribute('x', '0');
    drawZone.setAttribute('y', '0');
    drawZone.setAttribute('width', '1000');
    drawZone.setAttribute('height', '1000');
    document.body.appendChild(testRect);

    selectedZone = document.createElement('g');
    selectedZone.id = 'selectedZone';
    selectedZone.appendChild(testRect);

    svg = document.createElement('svg');
    svg.id = 'svg';
    svg.setAttribute('width', '1000');
    svg.setAttribute('height', '1000');
    svg.appendChild(drawZone);
    svg.appendChild(selectedZone);
    document.body.appendChild(svg);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('replaceTag and idTagPair[0] === selectedZone && selectedZone', () => {
    service.replaceTag(['rect0', 'Allo']);
    service.selectedZone = selectedZone;
    service.drawZone = selectedZone;
    service.replaceTag(['rect0', 'Allo']);
    expect(service.drawZone.innerHTML).toEqual('Allo');
    service.replaceTag(['idNonExistant', 'Allo']);
    expect(service.drawZone.innerHTML).toEqual('AlloAllo');
    service.replaceTag(['selectedZone', 'Allo']);
    expect(service.selectedZone.innerHTML).toEqual('Allo');

  });

  it('getDrawingElementById and drawZone false, return null', () => {
    const result = service.getDrawingElementById('idNonExistant');
    expect(result).toEqual(null);
    service.drawZone = selectedZone;
    expect(service.getDrawingElementById('rect0')).toBe(testRect);
  });

  it('getElementByIdFromSVG and svg false, return svg.querySelector', () => {
    const result = service.getElementByIdFromSVG('idNonExistant');
    expect(result).toEqual(null);
    service.svg = svg.querySelector('#selectedZone');
    expect(service.getElementByIdFromSVG('rect0')).toBe(testRect);
  });
});
