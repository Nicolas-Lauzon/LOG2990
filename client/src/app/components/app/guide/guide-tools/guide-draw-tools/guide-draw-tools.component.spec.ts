import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideBrushesComponent } from './guide-draw-tools.component';

describe('GuideBrushesComponent', () => {
  let component: GuideBrushesComponent;
  let fixture: ComponentFixture<GuideBrushesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideBrushesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideBrushesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
