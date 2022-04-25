/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ThumbnailComponent } from './thumbnail.component';

describe('ThumbnailComponent', () => {
  let component: ThumbnailComponent;
  let fixture: ComponentFixture<ThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailComponent);
    component = fixture.componentInstance;
    component.drawing = '<rect width="300" height="200" />';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect((component.thumbnail as SVGAElement).getAttribute('transform')).
    toEqual('scale(1 1)');
  });
});
