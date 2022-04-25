import { DrawingService } from 'src/app/services/drawing-service/drawing.service';
/* tslint:disable:no-unused-variable */
// tslint:disable: no-string-literal
/* tslint:disable:no-magic-numbers */

import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule, MatListModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { ExportDrawingService } from 'src/app/services/export-drawing-service/export-drawing.service';
import { DataService } from './../../../services/data-service/data.service';
import { GridService } from './../../../services/grid-service/grid.service';
import { ExportComponent } from './export.component';

describe('ExportComponent', () => {
  let component: ExportComponent;
  let content: HTMLElement;
  let input: HTMLInputElement;
  let input2: HTMLInputElement;
  let fixture: ComponentFixture<ExportComponent>;
  let image: HTMLImageElement;
  let grid: HTMLElement;
  let svg: SVGSVGElement;
  const toastrMock = {
    error: (s: string) => {/* */},
    success: (s: string) => {/* */},
};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportComponent ],
      imports: [MatListModule, MatSelectModule, MatInputModule, BrowserAnimationsModule],
      providers: [ ExportDrawingService, ExportComponent, GridService, DataService, DrawingService, HttpHandler, HttpClient,
         { provide: ToastrService, useValue: toastrMock } ]
    })
    .compileComponents();
  }));
  beforeEach(async () => {
    component = TestBed.inject(ExportComponent);

    image = document.createElement('img');
    image.setAttribute('id', 'image');
    document.body.appendChild(image);

    content = document.createElement('div');
    content.setAttribute('id', 'content');

    input = document.createElement('input');
    input.setAttribute('value', 'test');
    input.setAttribute('id', 'name');
    content.appendChild(input);

    input2 = document.createElement('input');
    input2.setAttribute('value', 'zakaria.boussoffara@polymtl.ca');
    input2.setAttribute('id', 'email');
    content.appendChild(input2);
    document.body.appendChild(content);
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'svg');
    document.body.appendChild(svg);

    component['serviceTable'][0].drawingElem = svg;
    component['serviceTable'][1].svg = svg;
    grid = document.createElement('div');
    grid.setAttribute('id', 'grid');
    component['serviceTable'][0].drawingElem.appendChild(grid);

    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exportDrawingButton should call the transform methods', () => {
    const spyPNG = spyOn(component['serviceTable'][0], 'transformToPNG');
    const spySVG = spyOn(component['serviceTable'][0], 'transformToSVG');
    const spyJPG = spyOn(component['serviceTable'][0], 'transformToJPG');

    component['clickedTable'][0] = true;
    component['clickedTable'][1] = true;
    component['clickedTable'][2] = true;
    component['clickedTable'][3] = true;
    component['elementRef'].nativeElement = content;
    component.exportDrawingButton();
    expect(spyPNG).toHaveBeenCalled();
    expect(spySVG).toHaveBeenCalled();
    expect(spyJPG).toHaveBeenCalled();

  });

  it('exportDrawingButton should call a wrong email', () => {
    const spyPNG = spyOn(component['serviceTable'][0], 'transformToPNG');
    const spySVG = spyOn(component['serviceTable'][0], 'transformToSVG');
    const spyJPG = spyOn(component['serviceTable'][0], 'transformToJPG');

    component['clickedTable'][0] = true;
    component['clickedTable'][1] = true;
    component['clickedTable'][2] = true;
    component['clickedTable'][3] = true;
    component['elementRef'].nativeElement = content;
    input2.setAttribute('value', 'fhsdjkhfsd');
    component.exportDrawingButton();
    expect(spyPNG).toHaveBeenCalled();
    expect(spySVG).toHaveBeenCalled();
    expect(spyJPG).toHaveBeenCalled();

  });

  it('changeSVG, changePNG, changeJPG should set the attributes to true', () => {
    component.changeJPG();
    component.changePNG();
    component.changeSVG();
    component.changeEmail();

    expect(component['clickedTable'][0]).toBeTruthy();
    expect(component['clickedTable'][1]).toBeTruthy();
    expect(component['clickedTable'][2]).toBeTruthy();
    expect(component['clickedTable'][3]).toBeTruthy();

  });
  it('applyFilter should call addFilter and changeThumbnail if the filter is on', () => {

    const spyService = spyOn(component['serviceTable'][0], 'addFilter' as never);
    const spyThumbnail = spyOn(component, 'changeThumbnail' as never);

    component['filters'][0] = true;

    component.applyFilter(0);

    expect(spyService).toHaveBeenCalled();
    expect(spyThumbnail).toHaveBeenCalled();

  });
  it('applyFilter should call removeFilter and changeThumbnail if the filter is off', () => {

    const spyService = spyOn(component['serviceTable'][0], 'removeFilter');
    const spyThumbnail = spyOn(component, 'changeThumbnail' as never);

    component['filters'][0] = false;

    component.applyFilter(0);

    expect(spyService).toHaveBeenCalled();
    expect(spyThumbnail).toHaveBeenCalled();

  });
  it('changeFilter should set the index value to true and set the others to false', () => {
    const result = [false, true, false, false, false];
    component.changeFilter(1);
    expect(component['filters']).toEqual(result);

  });
  it('changeThumbnail should set the src of the imageElement to the value of the drawing space', () => {
    const spy = spyOn(component['serviceTable'][0], 'getThumbnail');
    component['changeThumbnail']();

    expect(spy).toHaveBeenCalled();

  });
  it('validateForm returns the true when the form is correct and false when incorrect', () => {
    const key1 = new KeyboardEvent('keydown', { key: 'a' });
    expect(component.validateForm(key1)).toBeTruthy();

    const key2 = new KeyboardEvent('keydown', { key: '!'});
    expect(component.validateForm(key2)).toBeFalsy();

  });
});
