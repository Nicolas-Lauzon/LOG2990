
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatExpansionModule, MatFormFieldModule,
  MatIconModule, MatListModule, MatMenuModule,
  MatSelectModule, MatSidenavModule, MatSliderModule,
  MatSlideToggleModule, MatToolbarModule
} from '@angular/material';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DataService } from 'src/app/services/data-service/data.service';
import { ColorPaletComponent } from '../../color-palet/color-palet.component';
import { CreateDrawingComponent } from '../../create-drawing/create-drawing.component';
import { ExportComponent } from '../../export/export.component';
import { ThumbnailComponent } from '../../gallery/thumbnail/thumbnail.component';
import { GlobalGuideComponent } from '../../guide/global-guide/global-guide.component';
import { MainNavComponent } from '../../guide/main-nav/main-nav.component';
import { MenuComponent } from '../../start-menu/start-menu.component';
import { DrawingSpaceComponent } from '../drawing-space/drawing-space.component';
import { MainPageComponent } from '../main-page.component';
import { AttributesBrushComponent } from '../selection-menu/attributes/attributes-brush/attributes-brush.component';
import { AttributesBucketComponent } from '../selection-menu/attributes/attributes-bucket/attributes-bucket.component';
import { AttributesEllipseComponent } from '../selection-menu/attributes/attributes-ellipse/attributes-ellipse.component';
import { AttributesEraserComponent } from '../selection-menu/attributes/attributes-eraser/attributes-eraser.component';
import { AttributesGridComponent} from '../selection-menu/attributes/attributes-grid/attributes-grid.component';
import { AttributesLineComponent } from '../selection-menu/attributes/attributes-line/attributes-line.component';

import { AttributesPencilComponent } from '../selection-menu/attributes/attributes-pencil/attributes-pencil.component';
import { AttributesPolygonComponent } from '../selection-menu/attributes/attributes-polygon/attributes-polygon.component';
import { AttributesRectangleComponent } from '../selection-menu/attributes/attributes-rectangle/attributes-rectangle.component';
import { AttributesSprayComponent } from '../selection-menu/attributes/attributes-spray/attributes-spray.component';
import { ColorMenuComponent } from '../selection-menu/color-menu/color-menu.component';
import { QuickColorComponent } from '../selection-menu/color-menu/quick-color/quick-color.component';
import { SelectionMenuComponent } from '../selection-menu/selection-menu.component';
import { GalleryComponent } from './../../gallery/gallery.component';
import { SaveDrawingComponent } from './../../save-drawing/save-drawing.component';
import { SidebarComponent } from './sidebar.component';
describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalGuideComponent, AttributesBrushComponent, AttributesLineComponent,
        AttributesRectangleComponent, QuickColorComponent, AttributesPencilComponent,
        AttributesPencilComponent, ColorMenuComponent, SelectionMenuComponent, DrawingSpaceComponent,
        MainPageComponent, MainNavComponent, MenuComponent, ColorPaletComponent, AttributesBucketComponent,
        SidebarComponent, CreateDrawingComponent, AttributesEllipseComponent, AttributesPolygonComponent, AttributesEraserComponent,
        AttributesSprayComponent, AttributesGridComponent, SaveDrawingComponent, GalleryComponent, ExportComponent,
      ThumbnailComponent],
      imports: [MatListModule, MatIconModule,
        MatExpansionModule, AppRoutingModule,
        MatMenuModule, MatToolbarModule,
        MatSidenavModule, MatSlideToggleModule,
        FormsModule, ReactiveFormsModule,
        MatFormFieldModule, MatSelectModule,
        MatSliderModule],
      providers: [ DataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
