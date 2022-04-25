import { ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GuideSwitchDirective } from './guide-switch.directive';
describe('Directive: GuideSwitch', () => {
  let directive: GuideSwitchDirective;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuideSwitchDirective, ViewContainerRef]
    });
  });
  beforeEach(() => {
    directive = TestBed.inject(GuideSwitchDirective);
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });
});
