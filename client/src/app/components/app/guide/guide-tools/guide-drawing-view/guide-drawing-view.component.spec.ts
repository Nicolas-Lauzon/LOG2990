import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideDrawingViewComponent } from './guide-drawing-view.component';

describe('GuideDrawingViewComponent', () => {
  let component: GuideDrawingViewComponent;
  let fixture: ComponentFixture<GuideDrawingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideDrawingViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideDrawingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
