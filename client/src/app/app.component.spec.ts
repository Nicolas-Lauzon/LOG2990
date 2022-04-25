import { APP_BASE_HREF } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CreateDrawingComponent } from './../app/components/app/create-drawing/create-drawing.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColorPaletComponent } from './components/app/color-palet/color-palet.component';
import { MainNavComponent } from './components/app/guide/main-nav/main-nav.component';
import { DrawingSpaceComponent } from './components/app/main-page/drawing-space/drawing-space.component';
import { MainPageComponent } from './components/app/main-page/main-page.component';
import { AttributesBrushComponent } from './components/app/main-page/selection-menu/attributes/attributes-brush/attributes-brush.component';
import { AttributesLineComponent } from './components/app/main-page/selection-menu/attributes/attributes-line/attributes-line.component';
import {
         AttributesPencilComponent
       } from './components/app/main-page/selection-menu/attributes/attributes-pencil/attributes-pencil.component';
import { AttributesPolygonComponent
        } from './components/app/main-page/selection-menu/attributes/attributes-polygon/attributes-polygon.component';
import {
         AttributesRectangleComponent
       } from './components/app/main-page/selection-menu/attributes/attributes-rectangle/attributes-rectangle.component';
import { SelectionMenuComponent } from './components/app/main-page/selection-menu/selection-menu.component';
import { SidebarComponent } from './components/app/main-page/sidebar/sidebar.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        routingComponents,
        CreateDrawingComponent, ColorPaletComponent, MainPageComponent, SidebarComponent,
        SelectionMenuComponent,
        DrawingSpaceComponent,
        AttributesPencilComponent,
        AttributesBrushComponent,
        AttributesLineComponent,
        AttributesRectangleComponent,
        ColorPaletComponent,
        MainNavComponent,
        AttributesPolygonComponent

      ],
      imports: [AppRoutingModule, MatIconModule, MatFormFieldModule,
        MatFormFieldModule, MatInputModule, MatSelectModule,
        ReactiveFormsModule,
        FormsModule, MatSlideToggleModule, MatSliderModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        MatMenuModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
