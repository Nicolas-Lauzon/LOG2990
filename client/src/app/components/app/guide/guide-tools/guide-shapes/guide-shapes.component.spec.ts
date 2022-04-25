import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideShapesComponent } from './guide-shapes.component';

describe('GuideShapesComponent', () => {
  let component: GuideShapesComponent;
  let fixture: ComponentFixture<GuideShapesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideShapesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideShapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
