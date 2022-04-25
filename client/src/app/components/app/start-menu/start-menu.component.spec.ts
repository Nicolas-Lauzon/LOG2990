/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatFormFieldModule, MatInputModule, MatListModule,
         MatMenuModule, MatSelectModule, MatSidenavModule, MatToolbarModule,  } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { DataService } from 'src/app/services/data-service/data.service';
import { AppRoutingModule, routingComponents } from '../../../app-routing.module';
import { ColorPaletComponent } from '../color-palet/color-palet.component';
import { CreateDrawingComponent } from '../create-drawing/create-drawing.component';
import { ExportComponent } from '../export/export.component';
import { ThumbnailComponent } from '../gallery/thumbnail/thumbnail.component';
import { GlobalGuideComponent } from '../guide/global-guide/global-guide.component';
import { DrawingSpaceComponent } from '../main-page/drawing-space/drawing-space.component';
import { AttributesBrushComponent } from '../main-page/selection-menu/attributes/attributes-brush/attributes-brush.component';
import { AttributesBucketComponent } from '../main-page/selection-menu/attributes/attributes-bucket/attributes-bucket.component';
import { AttributesEllipseComponent
} from '../main-page/selection-menu/attributes/attributes-ellipse/attributes-ellipse.component';
import { AttributesEraserComponent } from '../main-page/selection-menu/attributes/attributes-eraser/attributes-eraser.component';

import { AttributesGridComponent } from '../main-page/selection-menu/attributes/attributes-grid/attributes-grid.component';
import { AttributesLineComponent } from '../main-page/selection-menu/attributes/attributes-line/attributes-line.component';
import { AttributesPencilComponent } from '../main-page/selection-menu/attributes/attributes-pencil/attributes-pencil.component';
import { AttributesPolygonComponent
} from '../main-page/selection-menu/attributes/attributes-polygon/attributes-polygon.component';
import { AttributesRectangleComponent } from '../main-page/selection-menu/attributes/attributes-rectangle/attributes-rectangle.component';
import { AttributesSprayComponent } from '../main-page/selection-menu/attributes/attributes-spray/attributes-spray.component';
import { ColorMenuComponent } from '../main-page/selection-menu/color-menu/color-menu.component';
import { QuickColorComponent } from '../main-page/selection-menu/color-menu/quick-color/quick-color.component';
import { SidebarComponent } from '../main-page/sidebar/sidebar.component';
import { GalleryComponent } from './../gallery/gallery.component';
import { SelectionMenuComponent } from './../main-page/selection-menu/selection-menu.component';
import { SaveDrawingComponent } from './../save-drawing/save-drawing.component';
import { MenuComponent } from './start-menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateDrawingComponent, QuickColorComponent,
                    ColorMenuComponent, MenuComponent, routingComponents, ColorPaletComponent, CreateDrawingComponent, SidebarComponent,
                    SelectionMenuComponent, DrawingSpaceComponent, GlobalGuideComponent, AttributesPencilComponent,
                    AttributesBrushComponent, AttributesLineComponent, AttributesRectangleComponent, AttributesPolygonComponent,
                    AttributesBrushComponent, AttributesLineComponent, AttributesRectangleComponent, AttributesEllipseComponent,
                    AttributesEraserComponent, AttributesSprayComponent, AttributesGridComponent, GalleryComponent,
                    SaveDrawingComponent, ExportComponent, ThumbnailComponent, AttributesBucketComponent],
      imports: [MatIconModule, AppRoutingModule, FormsModule, ReactiveFormsModule,
                MatFormFieldModule, MatInputModule, MatSelectModule, MatSidenavModule, MatToolbarModule, MatExpansionModule,
                MatMenuModule, MatListModule, MatSliderModule, MatSlideToggleModule],
      providers: [DataService]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('CTRL + o works when pressed', () => {
    const theForm = component.newForm;
    const event = new KeyboardEvent('keydown', { key: 'o', ctrlKey: true });
    component.onKeyDown(event);
    expect(component.newForm).toBe(!theForm);
  });

  it('CTRL + g works when pressed', () => {
    const event = new KeyboardEvent('keydown', { key: 'g', ctrlKey: true });
    component.onKeyDown(event);
    expect(component.newForm).toBe(false);
  });

  it('keyBoardEvent does not work when CTRL + w', () => {
    const theForm = component.newForm;
    const event = new KeyboardEvent('keydown', { key: 'w', ctrlKey: true });
    component.onKeyDown(event);
    expect(component.newForm).toBe(theForm);
  });

  it('Form changed when onClick called', () => {
    const theForm = component.newForm;
    component.onClick('Nouveau');
    expect(component.newForm).toBe(!theForm);
  });

  it('Form changed when onClick called', () => {
    component.onClick('notNouveau');
    expect(component.newForm).toBe(component.newForm);
  });

  it('onClick and menu= Galerie', () => {
    component.onClick('Galerie');
    expect(component.exitGallery).toBe(component.exitGallery);
  });

});
