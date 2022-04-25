import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideNewDrawingComponent } from './guide-new-drawing.component';

describe('GuideNewDrawingComponent', () => {
  let component: GuideNewDrawingComponent;
  let fixture: ComponentFixture<GuideNewDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideNewDrawingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideNewDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
