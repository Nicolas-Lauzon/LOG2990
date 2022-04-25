// tslint:disable:no-string-literal
// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule } from '@angular/material';
import { DataService } from 'src/app/services/data-service/data.service';
import { IntervalService } from './../../../../../../services/interval-service/interval.service';
import { AttributesEraserComponent } from './attributes-eraser.component';

describe('AttributesEraserComponent', () => {
  let component: AttributesEraserComponent;
  let fixture: ComponentFixture<AttributesEraserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesEraserComponent ],
      imports: [ MatSliderModule ],
      providers: [IntervalService, DataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesEraserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('focusOutValidation should only emit signal and not correct borderWidth if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentWidth = '5';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentWidth).toEqual('5');
    expect(component.eraserTool['selection'].eraserBox.dimensions[0]).toEqual(5);
  });

  it('focusOutValidation should only emit signal and correct borderWidth if its empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentWidth = '';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentWidth).toEqual('3');
    expect(component.eraserTool['selection'].eraserBox.dimensions[0]).toEqual(3);
  });

  it('onWidthSliderChange and value!==0 , eraserTool.eraserBox.dimensions = valuw', () => {
    spyOn(component['eraserTool']['selection']['eraserBox'], 'dimensions' as never);
    component.onWidthSliderChange(5);
    expect(component['eraserTool']['selection']['eraserBox'].dimensions[0]).toEqual(5);
  });

  it('onWidthInputChange, eraserTool.eraserBox.dimensions = valuw', () => {
    spyOn(component['eraserTool']['selection']['eraserBox'], 'dimensions' as never);
    component.onWidthInputChange(5);
    expect(component['eraserTool']['selection']['eraserBox'].dimensions[0]).toEqual(5);
  });
});
