// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule } from '@angular/material';
import { DrawStrategySprayService } from './../../../../../../services/draw-strategy/draw-startegy-spray/draw-strategy-spray.service';
import { IntervalService } from './../../../../../../services/interval-service/interval.service';

import { DataService } from 'src/app/services/data-service/data.service';
import { AttributesSprayComponent } from './attributes-spray.component';

describe('AttributesSprayComponent', () => {
  let component: AttributesSprayComponent;
  let fixture: ComponentFixture<AttributesSprayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesSprayComponent],
      imports: [ MatSliderModule ],
      providers: [DrawStrategySprayService, IntervalService, DataService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesSprayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.currentWidth).toBe(component.sprayTool.atributes[0].toString());
  });

  it('onSliderChange changes the spray width and doesnt consider value of 0', () => {
    component.onWidthSliderChange(20);
    expect(component.currentWidth).toEqual('20');
    expect(component.sprayTool.atributes[0]).toBe(20);
    component.onWidthSliderChange(0);
    expect(component.currentWidth).toEqual('20');
    expect(component.sprayTool.atributes[0]).toBe(20);
  });

  it('onTexteChange should cahnge the width ', () => {
    component.onWidthInputChange(500);
    expect(component.sprayTool.atributes[0]).toBe(500);
    expect(component.currentWidth).toEqual('500');
  });

  it('onSliderChange2 changes the circle radius and doesnt consider value of 0', () => {
    component.onSpraysPerSecondSliderChange(30);
    expect(component.spraysPerSeconds).toEqual('30');
    component.onSpraysPerSecondSliderChange(0);
    expect(component.spraysPerSeconds).toEqual('30');

  });
  it('onTexteChange2 should cahnge the sprays per seconde ', () => {
    component.onSprayInpuchange(500);
    expect(component.spraysPerSeconds).toEqual('500');
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

  it('focusOutValidation should only emit signal and not correct currentWidth if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentWidth = '5';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentWidth).toEqual('5');
    expect(component.sprayTool.atributes[0]).toEqual(5);
  });

  it('focusOutValidation should only emit signal and correct borderWidth if its empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentWidth = '';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentWidth).toEqual('1');
    expect(component.sprayTool.atributes[0]).toEqual(1);
  });

  it('focusOutValidation should only emit signal and not correct spraysPerSeconds if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.spraysPerSeconds = '5';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.spraysPerSeconds).toEqual('5');
    expect(component.sprayTool.atributes[1]).toEqual(5);
  });

  it('focusOutValidation should only emit signal and correct spraysPerSeconds if its empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.spraysPerSeconds = '';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.spraysPerSeconds).toEqual('1');
    expect(component.sprayTool.atributes[1]).toEqual(1);
  });

});
