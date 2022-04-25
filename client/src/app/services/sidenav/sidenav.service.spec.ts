/* tslint:disable:no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { GuideItem } from '../../components/app/guide/abstract-guide.component';
import { SidenavService } from './sidenav.service';
class MockComponent {
}

describe('SidenavService', () => {
  const fakeViewTab: GuideItem[] = [new GuideItem(MockComponent, {})];

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SidenavService = TestBed.inject(SidenavService);
    expect(service).toBeTruthy();
  });

  it('toggleView should set the value to 1 ', () => {
    const service: SidenavService = TestBed.inject(SidenavService);
    service.viewIndex = 0;
    service.toggleView(1);
    expect(service.viewIndex).toEqual(1);
  });
  it('increaseIndex should increment by 1 ', () => {
    const service: SidenavService = TestBed.inject(SidenavService);
    service.viewIndex = 0;
    service.increaseIndex();
    expect(service.viewIndex).toEqual(1);
  });
  it('increaseIndex should not overflow ', () => {
    const service: SidenavService = TestBed.inject(SidenavService);
    service.viewIndex = 7;
    service.increaseIndex();
    expect(service.viewIndex).toEqual(8);
  });
  it('decreaseIndex should decrement by 1 ', () => {
    const service: SidenavService = TestBed.inject(SidenavService);
    service.viewIndex = 1;
    service.decreaseIndex();
    expect(service.viewIndex).toEqual(0);
  });
  it('decreaseIndex should not overflow ', () => {
    const service: SidenavService = TestBed.inject(SidenavService);
    service.viewIndex = 0;
    service.decreaseIndex();
    expect(service.viewIndex).toEqual(0);
  });
  it('fullView should return the array of views ', () => {
    const service: SidenavService = TestBed.inject(SidenavService);
    const spy = spyOnProperty(service, 'fullView', 'get').and.returnValue(fakeViewTab);
    expect(service.fullView).toBe(fakeViewTab);
    expect(spy).toHaveBeenCalled();
  });
  it('fullView should be called ', () => {
    const service: SidenavService = TestBed.inject(SidenavService);
    service.views = fakeViewTab;
    expect(service.fullView).toBe(fakeViewTab);
  });
});
