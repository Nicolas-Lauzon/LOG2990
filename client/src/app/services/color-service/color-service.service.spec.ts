/* tslint:disable:no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { ColorService } from './color-service.service';

describe('ColorService', () => {
  let service: ColorService = new ColorService();
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    service = TestBed.inject(ColorService);
    expect(service).toBeTruthy();
  });

  it('test getters and setters', () => {
    service.setPrimary('dddddd');
    service.setSecondary('eeeeee');
    service.setPrimaryTransparancy(90);
    service.setSecondaryTransparancy(80);

    expect(service.getPrimaryColor()).toEqual('dddddde5');
    expect(service.getSecondaryColor()).toEqual('eeeeeecc');
  });

  it('test switch colors', () => {
    service = new ColorService();
    service.setPrimary('dddddd');
    service.setSecondary('eeeeee');
    service.switchColors();

    expect(service.getPrimaryColor()).toEqual('eeeeeeff');
    expect(service.getSecondaryColor()).toEqual('ddddddff');
  });

  it('test switch colors', () => {
    service = new ColorService();
    service.setPrimary('dddddd');
    service.setSecondary('eeeeee');
    service.setPrimary('dddd00');
    service.setSecondary('eeee00');
    service.updateRecentColors('dddddd');
    expect(service.recentColors[0]).toEqual('dddddd');
    service.updateRecentColors('dddddd');
    expect(service.recentColors[0]).toEqual('dddddd');
  });

});
