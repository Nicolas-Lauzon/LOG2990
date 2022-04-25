/* tslint:disable:no-unused-variable */
/* tslint:disable:no-magic-numbers */
/* tslint:disable: no-string-literal */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatListModule, MatSelectModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ColorPaletComponent } from '../color-palet/color-palet.component';
import { DrawingSpaceComponent } from '../main-page/drawing-space/drawing-space.component';
import { MainPageComponent } from '../main-page/main-page.component';
import { AttributesBrushComponent } from '../main-page/selection-menu/attributes/attributes-brush/attributes-brush.component';
import { AttributesBucketComponent } from '../main-page/selection-menu/attributes/attributes-bucket/attributes-bucket.component';
import { AttributesEllipseComponent } from '../main-page/selection-menu/attributes/attributes-ellipse/attributes-ellipse.component';
import { AttributesEraserComponent } from '../main-page/selection-menu/attributes/attributes-eraser/attributes-eraser.component';
import { AttributesGridComponent } from '../main-page/selection-menu/attributes/attributes-grid/attributes-grid.component';
import { AttributesLineComponent } from '../main-page/selection-menu/attributes/attributes-line/attributes-line.component';
import { AttributesPencilComponent } from '../main-page/selection-menu/attributes/attributes-pencil/attributes-pencil.component';
import { AttributesPolygonComponent } from '../main-page/selection-menu/attributes/attributes-polygon/attributes-polygon.component';
import { AttributesRectangleComponent } from '../main-page/selection-menu/attributes/attributes-rectangle/attributes-rectangle.component';
import { AttributesSprayComponent
        } from '../main-page/selection-menu/attributes/attributes-spray/attributes-spray.component';

import { QuickColorComponent } from '../main-page/selection-menu/color-menu/quick-color/quick-color.component';
import { SidebarComponent } from '../main-page/sidebar/sidebar.component';
import { DataService } from './../../../services/data-service/data.service';
import { WebClientService } from './../../../services/web-client/web-client.service';
import { ColorMenuComponent } from './../main-page/selection-menu/color-menu/color-menu.component';
import { SelectionMenuComponent } from './../main-page/selection-menu/selection-menu.component';
import { SaveDrawingComponent } from './../save-drawing/save-drawing.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Drawing } from 'src/app/drawing';
import { CreateDrawingComponent } from '../create-drawing/create-drawing.component';
import { ExportComponent } from '../export/export.component';
import { GalleryComponent } from './gallery.component';
import { ThumbnailComponent } from './thumbnail/thumbnail.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;
  const newDrawing: Drawing[] = [{_id: '1', title: 'title', drawingHtml: 'drawingHtml', tags: ['tag1'], toolIDs: [1, 2]}];
  const theDrawing = new BehaviorSubject(newDrawing);
  const toastrMock = {
    error: (s: string) => {/* */},
    success: (s: string) => {/* */},
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateDrawingComponent, ColorPaletComponent, MainPageComponent, SidebarComponent,
        SelectionMenuComponent,
        DrawingSpaceComponent,
        AttributesPencilComponent,
        AttributesBrushComponent,
        AttributesLineComponent,
        AttributesPolygonComponent,
        AttributesRectangleComponent,
        ColorPaletComponent, ColorMenuComponent,
        QuickColorComponent,
        AttributesEllipseComponent,
        AttributesEraserComponent,
        AttributesSprayComponent,
        SaveDrawingComponent,
        AttributesBucketComponent,
        AttributesGridComponent, GalleryComponent, ExportComponent, ThumbnailComponent],
      imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule,
        MatSelectModule, MatInputModule, MatSliderModule, MatSlideToggleModule, BrowserAnimationsModule,
        RouterTestingModule, HttpClientTestingModule, MatListModule, MatSelectModule,
        RouterTestingModule.withRoutes([
          { path: 'ZoneDessin', component: MainPageComponent }
        ])
      ],
      providers: [DataService, WebClientService, { provide: ToastrService, useValue: toastrMock }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['tagHandler'][1]).toEqual([]);
    expect(component['interruptors'].get('noResults')).toBeFalsy(false);
    expect(component['interruptors'].get('showAlert')).toBeFalsy(false);
    expect(component['drawings'][2]).toEqual('');
    expect(component['tagHandler'][0]).toEqual('');
  });

  it('should add and delete tags tags to the search', () => {
    component['tagHandler'][0] = 'allo';
    component['drawings'][0] = [];
    component.addTag();
    expect(component['tagHandler'][1].includes('allo')).toBeTruthy();
    component.removeTag('allo');
    expect(component['tagHandler'][1].includes('allo')).toBeFalsy();
  });

  it('should not add if empty string or if the string is already there', () => {
    component['tagHandler'][0] = 'allo';
    component['drawings'][0] = [];
    component.addTag();
    component.addTag();
    expect(component['tagHandler'][1].length).toBe(1);
    component['tagHandler'][0] = '';
    component.addTag();
    expect(component['tagHandler'][1].length).toBe(1);
  });

  it('should call ngOninit if tags is empty or search if there are still tags', () => {
    component['tagHandler'][0] = 'allo';
    component['drawings'][0] = [];
    component['drawings'][0].push({ _id: 'asd', title: 'hola', drawingHtml: 'asd', tags: ['allo'], toolIDs: [1, 2, 3, 4] });
    component['drawings'][0].push({ _id: 'asd', title: 'hola', drawingHtml: 'asd', tags: ['allo2'], toolIDs: [1, 2, 3, 4] });
    component.addTag();
    component['tagHandler'][0] = 'allo2';
    component.addTag();
    expect(component['drawings'][1].length).toBe(2);
    component.removeTag('allo');
    expect(component['drawings'][1].length).toBe(1);
    expect(component['interruptors'].set('noResults', true));
    component.removeTag('allo2');
    expect(component['interruptors'].get('noResults')).toBeFalsy();
  });

  it('Delete enleve le dessin des filtered et calls le service webClient', () => {
    component['drawings'][1] = [];
    component['drawings'][1].push({ _id: 'asd', title: 'hola', drawingHtml: 'asd', tags: ['allo'], toolIDs: [1, 2, 3, 4] });
    component['drawings'][1].push({ _id: 'asd', title: 'hola', drawingHtml: 'asd', tags: ['allo2'], toolIDs: [1, 2, 3, 4] });
    spyOn(component.services[0], 'deleteDrawing').and.callThrough();
    component.delete(component['drawings'][1][1]);
    expect(component['drawings'][1].length).toBe(1);
    expect(component.services[0].deleteDrawing).toHaveBeenCalled();
  });
  it('Replace should call data and router', () => {
    const rect = '<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />';
    component['drawings'][2] = rect;
    spyOn(component.services[1], 'changeDraw');
    component.replace();
    expect(component.services[1].changeDraw).toHaveBeenCalled();
    spyOn(component.services[4], 'navigate');
    component.replace();
    expect(component.services[4].navigate).toHaveBeenCalled();
  });

  it('Load should call dataservice and go to the drawing page if there is no active drawing', () => {
    const rect = '<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />';

    component['drawings'][1] = [];
    component['drawings'][1].push({ _id: 'asd', title: 'hola', drawingHtml: rect, tags: ['allo'], toolIDs: [1, 2, 3, 4] });
    component.services[1].changeDraw('');

    spyOn(component.services[4], 'navigate');
    component.load(component['drawings'][1][0]);
    expect(component.services[4].navigate).toHaveBeenCalled();
  });

  it('Load should show alert if drawing is active', () => {
    component.services[1].changeDraw('alloooo');
    component['drawings'][1] = [];
    component['drawings'][1].push({ _id: 'asd', title: 'hola', drawingHtml: 'mssiiii', tags: ['allo'], toolIDs: [1, 2, 3, 4] });
    component.load(component['drawings'][1][0]);
    expect(component['interruptors'].get('showAlert')).toBeTruthy();
    expect(component['drawings'][2]).toEqual('mssiiii');
  });

  it('Search should add the drawings with tags to the filtered drawings', () => {
    component['tagHandler'][0] = 'allo';
    component['drawings'][0] = [];
    component['drawings'][0].push({ _id: 'asd', title: 'hola', drawingHtml: 'asd', tags: ['allo'], toolIDs: [1, 2, 3, 4] });
    component['drawings'][0].push({ _id: 'asd', title: 'hola', drawingHtml: 'asd', tags: ['allo2'], toolIDs: [1, 2, 3, 4] });
    component.addTag();

    expect(component['drawings'][1].length).toBe(1);

  });

  it('Sort drawings sort the array in order', () => {
    component['tagHandler'][0] = 'allo';
    component['drawings'][0] = [];
    component['drawings'][0].push({ _id: 'a', title: 'a', drawingHtml: 'asd', tags: ['allo'], toolIDs: [1, 2, 3, 4, 5, 6, 7] });
    component['drawings'][0].push({ _id: 'c', title: 'c', drawingHtml: 'asd', tags: ['allo2'], toolIDs: [1, 2, 3, 4, 5, 6, 7] });
    component['drawings'][0].push({ _id: 'f', title: 'f', drawingHtml: 'asd', tags: ['allo'], toolIDs: [1, 2, 3, 4, 5, 6, 7] });
    component['drawings'][0].push({ _id: 'b', title: 'b', drawingHtml: 'asd', tags: ['allo2'], toolIDs: [1, 2, 3, 4, 5, 6, 7] });

    component['sortDrawings'](component['drawings'][0]);
    expect(component['drawings'][1][0].title).toEqual('a');
    expect(component['drawings'][1][1].title).toEqual('b');
    expect(component['drawings'][1][2].title).toEqual('c');
    expect(component['drawings'][1][3].title).toEqual('f');

  });

  it('NgOnInit works', () => {
    const tableDrawing: Observable<Drawing[]> = theDrawing.asObservable();
    spyOn(component.services[0], 'getAllDrawings').and.returnValue(tableDrawing);
    component.ngOnInit();
  });

  it('setToolsCurrentId should gave each tool their IDs on the server', () => {
    component['drawings'][0] = [];
    component['drawings'][0].push({ _id: 'a', title: 'a', drawingHtml: '', tags: ['allo'], toolIDs: [1, 2, 3, 4, 5, 6, 7] });
    const drawingToolsId = component['drawings'][0][0].toolIDs;
    component['setToolsCurrentId'](drawingToolsId);
    for (let i = 0 ; i <= 6 ; i++) {
      expect(component.tools[1][i].getCurrentId()).toEqual(drawingToolsId[i]);
    }
  });

});
