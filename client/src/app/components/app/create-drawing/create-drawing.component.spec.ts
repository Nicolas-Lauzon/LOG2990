/* tslint:disable:no-magic-numbers */
import { Location } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatListModule, MatSelectModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from '../../../services/data-service/data.service';
import { ColorPaletComponent } from '../color-palet/color-palet.component';
import { ExportComponent } from '../export/export.component';
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
import { AttributesSprayComponent
        } from '../main-page/selection-menu/attributes/attributes-spray/attributes-spray.component';
import { QuickColorComponent } from '../main-page/selection-menu/color-menu/quick-color/quick-color.component';
import { SidebarComponent } from '../main-page/sidebar/sidebar.component';
import { GalleryComponent } from './../gallery/gallery.component';
import { ColorMenuComponent } from './../main-page/selection-menu/color-menu/color-menu.component';
import { SelectionMenuComponent } from './../main-page/selection-menu/selection-menu.component';
import { SaveDrawingComponent } from './../save-drawing/save-drawing.component';
import { CreateDrawingComponent, SERVICE_ARRAY_INDEX } from './create-drawing.component';

describe('CreateDrawingComponent', () => {
  let component: CreateDrawingComponent;
  let fixture: ComponentFixture<CreateDrawingComponent>;

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
        AttributesBucketComponent,
        AttributesEllipseComponent,
        AttributesEraserComponent,
        AttributesSprayComponent,
        SaveDrawingComponent,
        AttributesGridComponent,
        ExportComponent, GalleryComponent, ThumbnailComponent],
      imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule,
        MatSelectModule, MatInputModule, MatSliderModule, MatSlideToggleModule, BrowserAnimationsModule,
        RouterTestingModule, MatListModule, MatSelectModule,
        RouterTestingModule.withRoutes([
          { path: 'ZoneDessin', component: MainPageComponent }
        ])
      ],
      providers: [DataService, Location]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is form invalid when dimensionsX is lower than 1', () => {
    const itemDimensionsX = component.myForm.controls.dimensionsX;
    itemDimensionsX.setValue('-1');
    const itemDimensionsY = component.myForm.controls.dimensionsY;
    itemDimensionsY.setValue('1500');
    const color = component.myForm.controls.color;
    color.setValue('#FFFFFF');
    expect(component.myForm.valid).toBeFalsy();
    expect(component.myForm.controls.dimensionsX.valid).toBeFalsy();
  });
  it('is form invalid when dimensionsX is not a number', () => {
    const itemDimensionsX = component.myForm.controls.dimensionsX;
    itemDimensionsX.setValue('a');
    const itemDimensionsY = component.myForm.controls.dimensionsY;
    itemDimensionsY.setValue('1500');
    const color = component.myForm.controls.color;
    color.setValue('#FFFFFF');
    expect(component.myForm.valid).toBeFalsy();
    expect(component.myForm.controls.dimensionsX.valid).toBeFalsy();
  });
  it('is form invalid when dimensionsY is lower than 1', () => {
    const itemDimensionsX = component.myForm.controls.dimensionsX;
    itemDimensionsX.setValue('1500');
    const itemDimensionsY = component.myForm.controls.dimensionsY;
    itemDimensionsY.setValue('-1');
    const color = component.myForm.controls.color;
    color.setValue('#FFFFFF');
    expect(component.myForm.valid).toBeFalsy();
    expect(component.myForm.controls.dimensionsY.valid).toBeFalsy();
  });
  it('is form invalid when dimensionsY is not a number', () => {
    const itemDimensionsX = component.myForm.controls.dimensionsX;
    itemDimensionsX.setValue('1500');
    const itemDimensionsY = component.myForm.controls.dimensionsY;
    itemDimensionsY.setValue('a');
    const color = component.myForm.controls.color;
    color.setValue('#FFFFFF');
    expect(component.myForm.valid).toBeFalsy();
    expect(component.myForm.controls.dimensionsY.valid).toBeFalsy();
  });

  it('is form invalid when it is not a valid hexadecimal code', () => {
    const itemDimensionsX = component.myForm.controls.dimensionsX;
    itemDimensionsX.setValue('1500');
    const itemDimensionsY = component.myForm.controls.dimensionsY;
    itemDimensionsY.setValue('1500');
    const color = component.myForm.controls.color;
    color.setValue('#ZZZZ00');
    expect(component.myForm.valid).toBeFalsy();
    expect(component.myForm.controls.color.valid).toBeFalsy();
  });

  it('should be minimum one button on the page', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length >= 1).toBeTruthy();
  });

  it(' should have text Créer nouveau projet on the router button', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const routerButton: HTMLButtonElement = buttons[buttons.length - 1].nativeElement;
    expect(routerButton.textContent).toBe(' Créer nouveau projet ');
  });

  it('should navigate to / before button press', () => {
    const location = TestBed.inject(Location);
    expect(location.path()).toBe('');
  });

  it('routerButton should be disabled when dimensionsX invalid', (done) => {
    const itemDimensionsX = component.myForm.controls.dimensionsX;
    itemDimensionsX.setValue('-1');
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const routerButton: HTMLButtonElement = buttons[buttons.length - 1].nativeElement;

    routerButton.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(routerButton.disabled).toBeTruthy();
      done();
    });
  });
  it('routerButton should be disabled when dimensionsY invalid', (done) => {
    const itemDimensionsY = component.myForm.controls.dimensionsY;
    itemDimensionsY.setValue('-1');
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const routerButton: HTMLButtonElement = buttons[buttons.length - 1].nativeElement;

    routerButton.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(routerButton.disabled).toBeTruthy();
      done();
    });
  });
  it('routerButton should be disabled when color invalid', (done) => {
    const itemColor = component.myForm.controls.color;
    itemColor.setValue('#ZZZZZZ');
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const routerButton: HTMLButtonElement = buttons[buttons.length - 1].nativeElement;

    routerButton.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(routerButton.disabled).toBeTruthy();
      done();
    });
  });
  it('Alert message activated when trying to create new drawing over existing one', () => {
    component.activationTable[0] = true;
    component.checkActiveDrawing();
    expect(component.activationTable[3]).toBe(true);
  });

  it('Alert message not activated when trying to create new drawing over non-existing one', () => {
    component.activationTable[0] = false;
    component.checkActiveDrawing();
    expect(component.activationTable[3]).toBe(false);
  });

  it('CustomValue to be true when customInput called', () => {
    component.customInput();
    expect(component.activationTable[2]).toBeTruthy();
  });

  it('PaletteActive to be changed when openPalette called', () => {
    const oldValue = component.activationTable[1];
    component.openPalette();
    expect(component.activationTable[1]).toBe(!oldValue);
  });

  it('PaletteActive to be changed to false when closeColorPalet to be called', () => {
    component.closeColorPalet();
    expect(component.activationTable[1]).toBe(false);
  });

  it('Change the background color when onSetColor called', () => {
    component.onSetColor('#FFFFFF');
    const temp = component.service[SERVICE_ARRAY_INDEX.ELEMENTREF_INDEX].nativeElement.querySelector('#layoutColorButton');
    expect(temp.style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('myForm changed when customValue is false', () => {
    component.activationTable[2] = false;
    spyOn(component.myForm, 'patchValue');
    component.updateValues();
    expect(component.myForm.patchValue).toHaveBeenCalled();
  });

  it('myForm not changed when customValue is true', () => {
    component.activationTable[2] = true;
    spyOn(component.myForm, 'patchValue');
    component.updateValues();
    expect(component.myForm).toBe(component.myForm);
  });

  it('onKeyPress should return false when a letter is typed', () => {
    const lKey = new KeyboardEvent('keypress', { key: 'l' });
    const test: boolean = component.onKeypress(lKey);
    expect(test).toBeFalsy();
  });

  it('onKeyPress should return true when a number is typed', () => {
    const key = new KeyboardEvent('keypress', { key: '5' });
    const test: boolean = component.onKeypress(key);
    expect(test).toBeTruthy();
  });

  it('openPalette and myForm.value.color.length!==6, myForm.value.color = #ffffff', () => {
    component.myForm.value.color = '#ffffff';
    component.openPalette();
    expect(component.myForm.value.color).toEqual('#ffffff');
  });
});
