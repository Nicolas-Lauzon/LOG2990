import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideColorToolsComponent } from './guide-color-tools.component';

describe('GuideColorToolsComponent', () => {
  let component: GuideColorToolsComponent;
  let fixture: ComponentFixture<GuideColorToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideColorToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideColorToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
