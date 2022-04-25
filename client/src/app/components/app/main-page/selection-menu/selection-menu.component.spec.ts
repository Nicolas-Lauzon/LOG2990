/* tslint:disable:no-unused-variable */
// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule, MatSelectModule, MatSliderModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DataService } from '../../../../services/data-service/data.service';
import { ColorPaletComponent } from '../../color-palet/color-palet.component';
import { AttributesBrushComponent } from './attributes/attributes-brush/attributes-brush.component';
import { AttributesBucketComponent } from './attributes/attributes-bucket/attributes-bucket.component';
import { AttributesEllipseComponent } from './attributes/attributes-ellipse/attributes-ellipse.component';
import { AttributesEraserComponent } from './attributes/attributes-eraser/attributes-eraser.component';
import { AttributesGridComponent } from './attributes/attributes-grid/attributes-grid.component';
import { AttributesLineComponent } from './attributes/attributes-line/attributes-line.component';
import { AttributesPencilComponent } from './attributes/attributes-pencil/attributes-pencil.component';
import { AttributesPolygonComponent } from './attributes/attributes-polygon/attributes-polygon.component';
import { AttributesRectangleComponent } from './attributes/attributes-rectangle/attributes-rectangle.component';
import { AttributesSprayComponent } from './attributes/attributes-spray/attributes-spray.component';
import { ColorMenuComponent } from './color-menu/color-menu.component';
import { QuickColorComponent } from './color-menu/quick-color/quick-color.component';
import { SelectionMenuComponent } from './selection-menu.component';

describe('Selection_menuComponent', () => {
  let component: SelectionMenuComponent;
  let fixture: ComponentFixture<SelectionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectionMenuComponent,
        AttributesPencilComponent,
        AttributesBrushComponent,
        AttributesLineComponent,
        AttributesRectangleComponent,
        AttributesEllipseComponent,
        ColorPaletComponent,
        QuickColorComponent,
        AttributesPolygonComponent,
        ColorMenuComponent,
        AttributesBucketComponent,
        AttributesEraserComponent,
        AttributesSprayComponent,
        AttributesGridComponent],
      imports: [
        MatSliderModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatSelectModule],
      providers: [DataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return shape icon index ', () => {
    expect(component.SHAPE_ICON_INDEX().POLYGON).toEqual(3);
  });

  it('should return tools  index ', () => {
    expect(component.TOOLS_INDEX().PENCIL).toEqual(1);
  });

  it('should return icon index ', () => {
    expect(component.DRAWING_ICON_INDEX().SPRAY).toEqual(2);
  });

  it('should return color icon index ', () => {
    expect(component.COLOR_ICON_INDEX().PICKER).toEqual(1);
  });
});
