/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('Service: DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    const dataService: DataService = TestBed.inject(DataService);
    expect(dataService).toBeTruthy();
  });

  it('changeFileName calls fileName.next', () => {
    spyOn(service['data'].fileName, 'next');
    service.changeFileName('hi');
    expect(service['data'].fileName.next).toHaveBeenCalled();
  });

  it('changeTags calls tags.next', () => {
    spyOn(service['data'].tags, 'next');
    service.changeTags('hi');
    expect(service['data'].tags.next).toHaveBeenCalled();
  });
  it('changeDimensionX calls dimensionX.next', () => {
    spyOn(service['data'].dimensionX, 'next');
    service.changeDimensionX(5);
    expect(service['data'].dimensionX.next).toHaveBeenCalled();
  });

  it('changeDimensionY calls dimensionY.next', () => {
    spyOn(service['data'].dimensionY, 'next');
    service.changeDimensionY(5);
    expect(service['data'].dimensionY.next).toHaveBeenCalled();
  });

  it('changeColor calls color.next', () => {
    spyOn(service['data'].color, 'next');
    service.changeColor('hi');
    expect(service['data'].color.next).toHaveBeenCalled();
  });

  it('changeDraw calls draw.next', () => {
    spyOn(service['data'].draw, 'next');
    service.changeDraw('hi');
    expect(service['data'].draw.next).toHaveBeenCalled();
  });

});
