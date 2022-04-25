import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule} from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { CreateDrawingComponent } from './../app/components/app/create-drawing/create-drawing.component';
import { GuideWelcomeComponent } from './../app/components/app/guide/guide-welcome/guide-welcome.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExportComponent } from './components/app/export/export.component';
import { GalleryComponent } from './components/app/gallery/gallery.component';
import { ThumbnailComponent } from './components/app/gallery/thumbnail/thumbnail.component';

import { ColorPaletComponent
} from './components/app/color-palet/color-palet.component';
import { GlobalGuideComponent
} from './components/app/guide/global-guide/global-guide.component';
import { GuideCreateDrawingComponent } from './components/app/guide/guide-files/guide-create-drawing/guide-create-drawing.component';
import { GuideExportDrawingComponent } from './components/app/guide/guide-files/guide-export-drawing/guide-export-drawing.component';
import { GuideSaveDrawingComponent } from './components/app/guide/guide-files/guide-save-drawing/guide-save-drawing.component';
import { GuideColorToolsComponent } from './components/app/guide/guide-tools/guide-color-tools/guide-color-tools.component';
import { GuideColorComponent } from './components/app/guide/guide-tools/guide-color/guide-color.component';
import { GuideBrushesComponent } from './components/app/guide/guide-tools/guide-draw-tools/guide-draw-tools.component';
import { GuideDrawingViewComponent } from './components/app/guide/guide-tools/guide-drawing-view/guide-drawing-view.component';
import { GuideGalleryComponent } from './components/app/guide/guide-tools/guide-gallery/guide-gallery.component';
import { GuideLineComponent } from './components/app/guide/guide-tools/guide-line/guide-line.component';
import { GuideNewDrawingComponent } from './components/app/guide/guide-tools/guide-new-drawing/guide-new-drawing.component';
import { GuideShapesComponent } from './components/app/guide/guide-tools/guide-shapes/guide-shapes.component';
import { GuideGridComponent } from './components/app/guide/guide-utilities/guide-grid/guide-grid.component';
import { GuideSelectionComponent } from './components/app/guide/guide-utilities/guide-selection/guide-selection.component';
import { GuideUndoRedoComponent } from './components/app/guide/guide-utilities/guide-undo-redo/guide-undo-redo.component';
import { MainNavComponent } from './components/app/guide/main-nav/main-nav.component';
import { DrawingSpaceComponent
} from './components/app/main-page/drawing-space/drawing-space.component';
import { MainPageComponent } from './components/app/main-page/main-page.component';
import { AttributesBrushComponent } from './components/app/main-page/selection-menu/attributes/attributes-brush/attributes-brush.component';
import { AttributesBucketComponent
} from './components/app/main-page/selection-menu/attributes/attributes-bucket/attributes-bucket.component';
import { AttributesEllipseComponent
} from './components/app/main-page/selection-menu/attributes/attributes-ellipse/attributes-ellipse.component';
import { AttributesEraserComponent
        } from './components/app/main-page/selection-menu/attributes/attributes-eraser/attributes-eraser.component';
import { AttributesGridComponent } from './components/app/main-page/selection-menu/attributes/attributes-grid/attributes-grid.component';
import { AttributesLineComponent } from './components/app/main-page/selection-menu/attributes/attributes-line/attributes-line.component';
import { AttributesPencilComponent
} from './components/app/main-page/selection-menu/attributes/attributes-pencil/attributes-pencil.component';
import { AttributesPolygonComponent
        } from './components/app/main-page/selection-menu/attributes/attributes-polygon/attributes-polygon.component';
import { AttributesRectangleComponent
} from './components/app/main-page/selection-menu/attributes/attributes-rectangle/attributes-rectangle.component';
import { AttributesSprayComponent } from './components/app/main-page/selection-menu/attributes/attributes-spray/attributes-spray.component';
import { ColorMenuComponent } from './components/app/main-page/selection-menu/color-menu/color-menu.component';
import { QuickColorComponent } from './components/app/main-page/selection-menu/color-menu/quick-color/quick-color.component';
import { SelectionMenuComponent } from './components/app/main-page/selection-menu/selection-menu.component';
import { SidebarComponent } from './components/app/main-page/sidebar/sidebar.component';
import { SaveDrawingComponent } from './components/app/save-drawing/save-drawing.component';
import { MenuComponent } from './components/app/start-menu/start-menu.component';
import { BackButtonDirective } from './directives/back-button/back-button.directive';
import { GuideSwitchDirective } from './directives/guide-switch/guide-switch.directive';
import { DataService } from './services/data-service/data.service';

@NgModule({
  declarations: [AppComponent,
    ColorMenuComponent,
    SidebarComponent,
    SelectionMenuComponent,
    DrawingSpaceComponent,
    MainPageComponent,
    routingComponents,
    MenuComponent,
    MainNavComponent,
    GlobalGuideComponent,
    GuideSwitchDirective,
    BackButtonDirective,
    GalleryComponent,
    GuideWelcomeComponent,
    GuideBrushesComponent,
    GuideLineComponent,
    GuideColorComponent,
    GuideNewDrawingComponent,
    GuideShapesComponent,
    GuideColorToolsComponent,
    GuideDrawingViewComponent,
    AppComponent,
    ThumbnailComponent,
    ColorPaletComponent,
    AttributesBrushComponent,
    AttributesLineComponent,
    AttributesPencilComponent,
    AttributesRectangleComponent,
    AttributesEllipseComponent,
    CreateDrawingComponent,
    QuickColorComponent,
    ExportComponent,
    AttributesEraserComponent,
    AttributesPolygonComponent,
    AttributesSprayComponent,
    AttributesGridComponent,
    SaveDrawingComponent,
    GuideGridComponent,
    GuideUndoRedoComponent,
    GuideSelectionComponent,
    GuideGalleryComponent,
    GuideSaveDrawingComponent,
    GuideExportDrawingComponent,
    GuideCreateDrawingComponent,
    AttributesBucketComponent
  ],

  imports: [BrowserModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    AppRoutingModule,
    MatIconModule,
    MatSelectModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    MatSliderModule,
    MatSlideToggleModule
  ],
  exports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule],
  providers: [DataService],
  bootstrap: [AppComponent],
  entryComponents: [
    GlobalGuideComponent,
    GuideWelcomeComponent,
    GuideBrushesComponent,
    GuideDrawingViewComponent,
    GuideLineComponent,
    GuideColorComponent,
    GuideShapesComponent,
    GuideColorToolsComponent,
    GuideNewDrawingComponent,
    GuideGalleryComponent,
    GuideSelectionComponent,
    GuideGridComponent,
    GuideUndoRedoComponent,
    GuideSaveDrawingComponent,
    GuideCreateDrawingComponent,
    GuideExportDrawingComponent
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppModule { }
