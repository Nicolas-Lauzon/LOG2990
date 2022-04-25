import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideCreateDrawingComponent } from './guide-create-drawing.component';

describe('GuideCreateDrawingComponent', () => {
  let component: GuideCreateDrawingComponent;
  let fixture: ComponentFixture<GuideCreateDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideCreateDrawingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideCreateDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
