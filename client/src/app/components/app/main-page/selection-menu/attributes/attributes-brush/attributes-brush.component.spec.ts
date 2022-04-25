/* tslint:disable:no-unused-variable */
/* tslint:disable:no-magic-numbers */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule } from '@angular/material';
import { DataService } from 'src/app/services/data-service/data.service';
import { USER_OPTION
} from './../../../../../../services/draw-strategy/draw-strategy-brush/draw-strategy-brush.service';
import { AttributesBrushComponent } from './attributes-brush.component';

describe('AttributesBrushComponent', () => {
  let component: AttributesBrushComponent;
  let fixture: ComponentFixture<AttributesBrushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttributesBrushComponent],
      imports: [MatSliderModule],
      providers: [DataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesBrushComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.currentWidth).toEqual('1');
  });

  it('brushFilterShadChanger changes the filter', () => {
    component.onClickFilter(2);
    expect(component.brushFilterIndex).toBe(2);
    component.onClickFilter(2);
    expect(component.brushFilterIndex).toBe(2);
    expect(component.brushStatus[component.brushFilterIndex]).toEqual('active');
    component.onClickFilter(3);
    expect(component.brushFilterIndex).toBe(3);
    expect(component.brushStatus[2]).toEqual('');
  });

  it('onSliderChange changes the pencil width and doesnt consider value of 0', () => {
    component.onSliderChange(20);
    expect(component.currentWidth).toEqual('20');
    expect(component.drawBrushTool.userOptions[USER_OPTION.WIDTH]).toBe(20);
    component.onSliderChange(0); // une valeur de 0 garde la derniere valeur
    expect(component.currentWidth).toEqual('20');
    expect(component.drawBrushTool.userOptions[USER_OPTION.WIDTH]).toBe(20);
  });

  it('onTexteChange should cahnge the width ', () => {
    component.onTextChange(2);
    expect(component.drawBrushTool.userOptions[USER_OPTION.WIDTH]).toBe(2);
    expect(component.currentWidth).toEqual('2');
  });

  it('onKeyPress should return false when a letter is typed', () => {
    const lKey = new KeyboardEvent('keypress', { key: 'l' });
    const test: boolean = component.onKeypress(lKey);
    expect(test).toBeFalsy();
  });

  it('onKeyPress should return true when a number is typed', () => {
    const keyFive = new KeyboardEvent('keypress', { key: '5' });
    const test: boolean = component.onKeypress(keyFive);
    expect(test).toBeTruthy();
  });

  it('focusOutValidation should only emit signal and not correct currentWidth if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentWidth = '5';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentWidth).toEqual('5');
    expect(component.drawBrushTool.userOptions[USER_OPTION.WIDTH]).toEqual(5);
  });

  it('focusOutValidation should only emit signal and correct currentWidth if its empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentWidth = '';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentWidth).toEqual('1');
    expect(component.drawBrushTool.userOptions[USER_OPTION.WIDTH]).toEqual(1);
  });

});
