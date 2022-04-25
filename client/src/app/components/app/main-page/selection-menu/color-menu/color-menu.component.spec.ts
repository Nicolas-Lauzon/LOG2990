// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { DataService } from 'src/app/services/data-service/data.service';
import { ColorPaletComponent } from '../../../color-palet/color-palet.component';
import { ColorService } from './../../../../../services/color-service/color-service.service';
import { COLOR_INFO, ColorMenuComponent} from './color-menu.component';
import { QuickColorComponent } from './quick-color/quick-color.component';

describe('ColorMenuComponent', () => {
  let component: ColorMenuComponent;
  let fixture: ComponentFixture<ColorMenuComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorMenuComponent, ColorPaletComponent, QuickColorComponent],
      providers: [ColorService, DataService],
      imports: [MatSliderModule, MatSlideToggleModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeColor should be called if activePaletIndex is equal to 3', () => {
    const g = document.createElement('g');
    g.id = 'rect1';
    const testRect = document.createElement('rect');
    testRect.setAttribute('id', 'background');
    testRect.setAttribute('x' , '5');
    testRect.setAttribute('y' , '5');
    testRect.setAttribute('width' , '5');
    testRect.setAttribute('height' , '5');
    g.appendChild(testRect);

    component['drawBoardService'].drawboard = g;
    const dataService = fixture.debugElement.injector.get(DataService);
    const dataSpy = spyOn(dataService, 'changeColor').and.callThrough();
    fixture.detectChanges();
    component['colorInformations'][COLOR_INFO.ACTIVE_PALET]  = 3;
    component.onSetColor('#FFFFFF');
    expect(dataService.changeColor).toHaveBeenCalled();
    expect(dataSpy).toHaveBeenCalled();
    expect(dataSpy.calls.any()).toBeTruthy();
  });

  it('changeColor should be called if activePaletIndex is equal to 2', () => {
    const colorService = fixture.debugElement.injector.get(ColorService);
    const colorSpy = spyOn(colorService, 'setSecondary').and.callThrough();
    fixture.detectChanges();
    component['colorInformations'][COLOR_INFO.ACTIVE_PALET]  = 2;
    component.onSetColor('#FFFFFF');
    expect(colorService.setSecondary).toHaveBeenCalled();
    expect(colorSpy).toHaveBeenCalled();
    expect(colorSpy.calls.any()).toBeTruthy();
  });

  it('changeColor should be called if activePaletIndex is equal to 1', () => {
    const colorService = fixture.debugElement.injector.get(ColorService);
    const colorSpy = spyOn(colorService, 'setPrimary').and.callThrough();
    fixture.detectChanges();
    component['colorInformations'][COLOR_INFO.ACTIVE_PALET]  = 1;
    component.onSetColor('#FFFFFF');
    expect(colorService.setPrimary).toHaveBeenCalled();
    expect(colorSpy).toHaveBeenCalled();
    expect(colorSpy.calls.any()).toBeTruthy();
  });

  it('Change activePaletIndex when closeCOlorPalet called', () => {
    component.closeColorPalet();
    expect(component['colorInformations'][COLOR_INFO.ACTIVE_PALET] ).toBe(0);
  });

  it('currentColor changes value when openColorPalet is called with index 1', () => {
    component['colorSelection'].primaryColor = '#FFFFFF';
    component.openColorPalet(1);
    expect(component['colorInformations'][COLOR_INFO.ACTIVE_PALET] ).toBe(1);
    expect(component['colorInformations'][COLOR_INFO.CURRENT_COLOR] ).toBe(component['colorSelection'].primaryColor);
  });

  it('currentColor changes value when openColorPalet is called with index 2', () => {
    component['colorSelection'].secondaryColor = '#FFFFFF';
    component.openColorPalet(2);
    expect(component['colorInformations'][COLOR_INFO.ACTIVE_PALET] ).toBe(2);
    expect(component['colorInformations'][COLOR_INFO.CURRENT_COLOR] ).toBe(component['colorSelection'].secondaryColor);
  });

  it('currentColor changes value when openColorPalet is called with index 3', () => {
    component['colorSelection'].backgroundColor = '#FFFFFF';
    component.openColorPalet(3);
    expect(component['colorInformations'][COLOR_INFO.ACTIVE_PALET] ).toBe(3);
    expect(component['colorInformations'][COLOR_INFO.CURRENT_COLOR] ).toBe(component['colorSelection'].backgroundColor);
  });

  it('currentPrimaryTransparency is changed when onSetPrimaryTransparency called', () => {
    component.onSetPrimaryTransparency(1);
    expect(component['colorInformations'][COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY] ).toBe(1);
  });

  it('currentSecondaryTransparency is changed when onSetSecondaryTransparency called', () => {
    component.onSetSecondaryTransparency(1);
    expect(component['colorInformations'][COLOR_INFO.CURRENT_SECONDARY_TRANSPARENCY] ).toBe(1);
  });

  it('switchColors called when onSwitchColor called', () => {
    spyOn(component['colorSelection'], 'switchColors');
    component.onSwitchColor();
    expect(component['colorSelection'].switchColors).toHaveBeenCalled();
  });

  it('onSelector is called', () => {
    spyOn(component, 'onSetColor');
    component.onSetQuickColor([1, '#FFFFFF']);
    expect(component.onSetColor).toHaveBeenCalled();
  });

  it('onKeyPress should return false when a letter is typed', () => {
    const lKey = new KeyboardEvent('keypress', { key: 'l' });
    const test: boolean = component.onKeypress(lKey);
    expect(test).toBeFalsy();
  });

  it('onKeyPress should return true when a number is typed', () => {
    const key5 = new KeyboardEvent('keypress', { key: '5' });
    const test: boolean = component.onKeypress(key5);
    expect(test).toBeTruthy();
  });

  it('focusOutValidation should only emit signal and not correct currentPrimaryTransparency if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component['colorInformations'][COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY]  = 5;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component['colorInformations'][COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY] ).toEqual(5);
    expect(component['colorSelection'].transparencyPrimaryColor).toEqual('0c');
  });

  it('focusOutValidation should only emit signal and correct currentPrimaryTransparency if its too small or empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component['colorInformations'][COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY]  = 0;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component['colorInformations'][COLOR_INFO.CURRENT_PRIMARY_TRANSPARENCY] ).toEqual(1);
    expect(component['colorSelection'].transparencyPrimaryColor).toEqual('02');
  });

});
