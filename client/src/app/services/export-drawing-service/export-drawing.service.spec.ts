/* tslint:disable:no-string-literal */
/* tslint:disable:no-magic-numbers */
// tslint:disable: max-line-length

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './../data-service/data.service';
import { GridService } from './../grid-service/grid.service';
import { ExportDrawingService } from './export-drawing.service';

describe('ExportDrawingService', () => {
  let service: ExportDrawingService;
  let download: HTMLAnchorElement;
  let input: HTMLInputElement;
  let drawboard: HTMLElement;
  let grid: HTMLElement;
  const toastrMock = {
    error: (s: string) => {/* */},
    success: (s: string) => {/* */},
};

  beforeEach(() => TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [ExportDrawingService, GridService, DataService,
  { provide: ToastrService, useValue: toastrMock }] }));

  beforeEach(async () => {
    service = TestBed.inject(ExportDrawingService);
    download = document.createElement('a');
    download.download = 'drawing.png';
    download.href = '../../../assets/test_download.png';
    document.body.appendChild(download);

    input = document.createElement('input');
    input.setAttribute('value', 'test');
    input.setAttribute('id', 'name');
    document.body.appendChild(input);

    service.drawingElem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    service.drawingElem.setAttribute('id', 'svg');
    document.body.appendChild(service.drawingElem);

    drawboard = document.createElement('g');
    drawboard.setAttribute('id', 'drawboard');
    service.drawingElem.appendChild(drawboard);

    grid = document.createElement('div');
    grid.setAttribute('id', 'grid');
    service.drawingElem.appendChild(grid);

  });
  it('should be created', () => {
    service = TestBed.inject(ExportDrawingService);
    expect(service).toBeTruthy();
  });

  it('transformToPNG should call downloadPopUp', async (done) => {
    const spy = spyOn(service, 'downloadPopUp' as never);
    service.transformToPNG(true);
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 2200);

  });

  it('transformToPNG should call downloadPopUp',   () => {
    service.setName('');
    service['downloadPopUp']('', '', '', true);
    expect(service['name']).toEqual('default');
  });
  it('transformToJPG should call downloadPopUp', async (done) => {
    const spy = spyOn(service, 'downloadPopUp' as never);
    service.transformToJPG(true);
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    }, 2200);

  });
  it('transformToSVG should call downloadPopUp', async () => {
    const spy = spyOn(service, 'downloadPopUp' as never);
    service.transformToSVG(true);
    expect(spy).toHaveBeenCalled();

  });

  it('add filter should add a filter to the svg', () => {
    service.addFilter(1);
    expect(drawboard.style.filter).toEqual('url("#filter7")');
  });

  it('remove filter should remove the filter form the svg', () => {
    service.removeFilter(1);
    expect(drawboard.style.filter).toEqual('');
  });

  it('getThumbnail should return an image', () => {
    service['grid'].isActive = true;
    expect(service.getThumbnail()).toEqual('data:image/svg+xml;base64,PHN2ZyBpZD0ic3ZnIj48ZyBpZD0iZHJhd2JvYXJkIj48L2c+PGRpdiBpZD0iZ3JpZCI+PC9kaXY+PC9zdmc+');
  });
  it('downloadPopUp should set the href and download to the value in parameters', () => {
    expect(service['downloadPopUp']('../../../assets/test_download.png', '.png', ' ', true)).toEqual(download);

  });

  it('setName sets the name to the value in parameters', () => {
    service.setName('aaaaa');
    expect(service['name']).toEqual('aaaaa');

  });

});
