/* tslint:disable:no-string-literal no-magic-numbers */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatListModule, MatSelectModule } from '@angular/material';

import {MatInputModule} from '@angular/material/input';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { ColorPaletComponent } from '../color-palet/color-palet.component';
import { CreateDrawingComponent } from '../create-drawing/create-drawing.component';
import { ExportComponent } from '../export/export.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { ThumbnailComponent } from '../gallery/thumbnail/thumbnail.component';
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
import { AttributesSprayComponent} from '../main-page/selection-menu/attributes/attributes-spray/attributes-spray.component';
import { QuickColorComponent } from '../main-page/selection-menu/color-menu/quick-color/quick-color.component';
import { SidebarComponent } from '../main-page/sidebar/sidebar.component';
import { DataService } from './../../../services/data-service/data.service';
import { WebClientService } from './../../../services/web-client/web-client.service';
import { ColorMenuComponent } from './../main-page/selection-menu/color-menu/color-menu.component';
import { SelectionMenuComponent } from './../main-page/selection-menu/selection-menu.component';
import { SaveDrawingComponent, SERVICE } from './../save-drawing/save-drawing.component';

describe('SaveDrawingComponent', () => {
  let component: SaveDrawingComponent;
  let fixture: ComponentFixture<SaveDrawingComponent>;
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
        AttributesBucketComponent,
        AttributesEraserComponent,
        AttributesSprayComponent,
        SaveDrawingComponent,
        AttributesGridComponent, GalleryComponent, ExportComponent, ThumbnailComponent ],
      imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule,
        MatSelectModule, MatInputModule, MatSliderModule, MatSlideToggleModule, BrowserAnimationsModule,
        RouterTestingModule, HttpClientTestingModule, MatListModule, MatSelectModule,
        RouterTestingModule.withRoutes([
          { path: 'ZoneDessin', component: MainPageComponent }
        ])
      ],
      providers: [DataService, WebClientService, MainPageComponent, { provide: ToastrService, useValue: toastrMock }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is not valid when its empty', () => {
    expect(component.myForm.valid).toBeFalsy();
  });

  it('form is valid when good values entered', () => {
    const itemTags = component.myForm.controls.tags;
    itemTags.setValue('tag1');
    const itemFileName = component.myForm.controls.fileName;
    itemFileName.setValue('allo');
    expect(component.myForm.valid).toBeTruthy();
  });

  it('form is invalid when a space is entered in fileName', () => {
    const itemTags = component.myForm.controls.tags;
    itemTags.setValue('tag1');
    const itemFileName = component.myForm.controls.fileName;
    itemFileName.setValue('allo allo2');
    expect(component.myForm.valid).toBeFalsy();
  });

  it('form is invalid when a space is entered in tags', () => {
    const itemTags = component.myForm.controls.tags;
    itemTags.setValue('tag1 tag2');
    const itemFileName = component.myForm.controls.fileName;
    itemFileName.setValue('allo');
    expect(component.myForm.valid).toBeFalsy();
  });

  it('form is invalid when tag exceeds 10 caracters', () => {
    const itemTags = component.myForm.controls.tags;
    itemTags.setValue('1234567891011');
    expect(itemTags.hasError('maxlength')).toBeTruthy();
    const itemFileName = component.myForm.controls.fileName;
    itemFileName.setValue('allo');
    expect(component.myForm.valid).toBeFalsy();
  });

  it('form is invalid when title is empty', () => {
    const itemTags = component.myForm.controls.tags;
    itemTags.setValue('tag1');
    expect(itemTags.hasError('maxlength')).toBeFalsy();
    const itemFileName = component.myForm.controls.fileName;
    itemFileName.setValue('');
    expect(component.myForm.valid).toBeFalsy();
  });

  it('addTag and getError is not none, return nothing', () => {
    spyOn(component, 'getError').and.returnValue('someting');
    const result = component.addTag();
    expect(result).toEqual();
  });

  it('addTag and getError is none and drawingElement[DRAWING_ELEMENT.CURRENT_TAG] = nothing, return nothing', () => {
    spyOn(component, 'getError').and.returnValue('none');
    component.drawingElement[2] = '';
    const result = component.addTag();
    expect(result).toEqual();
  });

  it('addTag and getError is none and drawingElement[DRAWING_ELEMENT.CURRENT_TAG] = someting, place currentTag = nothing', () => {
    spyOn(component, 'getError').and.returnValue('none');
    component.drawingElement[2] = 'something';
    component.addTag();
    expect(component.drawingElement[2]).toEqual('');
  });

  it('getError should return none if tags is valid', () => {
    const itemTags = component.myForm.controls.tags;
    itemTags.setValue('tag1');
    const test = component.getError();
    expect(test).toEqual('none');
  });

  it('getError should return maxlength if tags length exceeds 10 caracters', () => {
    const itemTags = component.myForm.controls.tags;
    itemTags.setValue('wordIsTooLong');
    const test = component.getError();
    expect(test).toEqual('Le nom du tag est trop long.');
  });

  it('getError should return pattern if tags is not a single word of letters and numbers', () => {
    const itemTags = component.myForm.controls.tags;
    itemTags.setValue('tag1 ;');
    const test = component.getError();
    expect(test).toEqual('Veuillez entrez que des lettres ou des chiffres sans espace.');
  });

  it('removeTag should call drawingElement.splice', () => {
    spyOn(component.drawingElement[3], 'splice' as never);
    component.removeTag('hi');
    expect(component.drawingElement[3].splice).toHaveBeenCalled();
  });

  it('getError should return none if tags is null', () => {
    const itemTags = component.myForm.controls.tags;
    itemTags.setValue(null);
    const test = component.getError();
    expect(test).toEqual('none');
  });

  it('onKeyPress should return false when an invalid caracter is typed', () => {
    const key = new KeyboardEvent('keypress', { key: ';' });
    const test: boolean = component.onKeypress(key);
    expect(test).toBeFalsy();
  });

  it('onKeyPress should return true when a number is typed', () => {
    const key = new KeyboardEvent('keypress', { key: '5' });
    const test: boolean = component.onKeypress(key);
    expect(test).toBeTruthy();
  });

  it('saveData should put showComponent to true if fileName !== "" and is firstTimeDraw', () => {
    spyOn(component.serviceTable[SERVICE.WEBCLIENTSERVICE_INDEX], 'addDrawing');

    const test = fixture.debugElement.nativeElement.querySelector('#center');
    component.serviceTable[0].drawboard = test;

    const itemFileName = component.myForm.controls.fileName;
    itemFileName.setValue('file1');
    component.saveData();
    expect(component.serviceTable[SERVICE.WEBCLIENTSERVICE_INDEX].addDrawing).toHaveBeenCalled();
    expect(component.showComponent).toBeTruthy();
  });

});
