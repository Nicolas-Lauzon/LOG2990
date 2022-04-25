/* tslint:disable:no-unused-variable */
// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { DataService } from 'src/app/services/data-service/data.service';
import { DIMENSIONS, IS_USED } from './../../../../../../services/draw-strategy/draw_strategy-line/draw-strategy-line.service';
import { AttributesLineComponent } from './attributes-line.component';
describe('AttributesLineComponent', () => {
  let component: AttributesLineComponent;
  let fixture: ComponentFixture<AttributesLineComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesLineComponent ],
      imports: [ MatSliderModule, MatSlideToggleModule ],
      providers: [ DataService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    component.lineDrawTool.isUsed[IS_USED.JOINT] = false;
    expect(component.currentLineWidth).toBe(component.lineDrawTool.dimensions[DIMENSIONS.LINE_WIDTH].toString());
    expect(component.currentJointWidth).toBe(component.lineDrawTool.dimensions[DIMENSIONS.JOINT_RADIUS].toString());
  });
  it('changeToglle works properly ', () => {
    component.onJunctionToggle(true);
    expect(component.lineDrawTool.isUsed[IS_USED.JOINT]).toBe(true);
    component.onJunctionToggle(false);
    expect(component.lineDrawTool.isUsed[IS_USED.JOINT]).toBe(false);
    expect(fixture.debugElement.query(By.css('.if'))).toBeNull(); // v/rifier si le ngif du html marche
  });
  it('onTestChange and onTextChange2 work properly ', () => {
    component.onWidthInputChange(3);
    expect(component.lineDrawTool.dimensions[DIMENSIONS.LINE_WIDTH]).toBe(3);
    expect(component.currentLineWidth).toEqual('3');
    component.onJunctionRadiusInputChange(2);
    expect(component.lineDrawTool.dimensions[DIMENSIONS.JOINT_RADIUS]).toBe(2);
    expect(component.currentJointWidth).toEqual('2');
  });

  it('onSliderChange changes the line width and doesnt consider value of 0', () => {
    component.onWidthSliderChange(20);
    expect(component.currentLineWidth).toEqual('20');
    expect(component.lineDrawTool.dimensions[DIMENSIONS.LINE_WIDTH]).toBe(20);
    component.onWidthSliderChange(0);
    expect(component.currentLineWidth).toEqual('20');
    expect(component.lineDrawTool.dimensions[DIMENSIONS.LINE_WIDTH]).toBe(20);
  });
  it('onSliderChange2 changes the circle radius and doesnt consider value of 0', () => {
    component.onJunctionRadiusSliderChange(30);
    expect(component.currentJointWidth).toEqual('30');
    expect(component.lineDrawTool.dimensions[DIMENSIONS.JOINT_RADIUS]).toBe(30);
    component.onJunctionRadiusSliderChange(0);
    expect(component.currentJointWidth).toEqual('30');
    expect(component.lineDrawTool.dimensions[DIMENSIONS.JOINT_RADIUS]).toBe(30);
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

  it('focusOutValidation should emit signal and not correct currentLineWidth if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentLineWidth = '5';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentLineWidth).toEqual('5');
    expect(component.lineDrawTool.dimensions[DIMENSIONS.LINE_WIDTH]).toEqual(5);
  });

  it('focusOutValidation should only emit signal and correct borderWidth if its empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentLineWidth = '';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentLineWidth).toEqual('1');
    expect(component.lineDrawTool.dimensions[DIMENSIONS.LINE_WIDTH]).toEqual(1);
  });

  it('focusOutValidation should emit signal and not correct currentJointWidth if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentJointWidth = '5';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentJointWidth).toEqual('5');
    expect(component.lineDrawTool.dimensions[DIMENSIONS.JOINT_RADIUS]).toEqual(5);
  });

  it('focusOutValidation should only emit signal and correct borderWidth if its empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentJointWidth = '';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentJointWidth).toEqual('1');
    expect(component.lineDrawTool.dimensions[DIMENSIONS.JOINT_RADIUS]).toEqual(1);
  });

});
