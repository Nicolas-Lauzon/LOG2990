// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule, MatSelectModule, MatSliderModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataService } from 'src/app/services/data-service/data.service';
import { DrawStrategyEllipseService } from '../../../../../../services/draw-strategy/draw-strategy-ellipse/draw-strategy-ellipse.service';
import { AttributesEllipseComponent } from './attributes-ellipse.component';

describe('AttributesEllipseComponent', () => {
  let component: AttributesEllipseComponent;
  let fixture: ComponentFixture<AttributesEllipseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesEllipseComponent ],
      imports: [ MatSliderModule, MatFormFieldModule, MatSelectModule, BrowserAnimationsModule ],
      providers: [ DrawStrategyEllipseService, DataService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesEllipseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.currentBorderWidth).toBe(component.drawEllipseShape.attributes[0].toString());
    expect(component.rectangleType).toBe(component.drawEllipseShape.attributes[1]);
  });

  it('onSliderChange changes the pencil width and doesnt consider value of 0', () => {
    component.onWidthSliderChange(20);
    expect(component.currentBorderWidth).toEqual('20');
    expect(component.drawEllipseShape.attributes[0]).toBe(20);
    component.onWidthSliderChange(0);                  // une valeur de 0 garde la derniere valeur
    expect(component.currentBorderWidth).toEqual('20');
    expect(component.drawEllipseShape.attributes[0]).toBe(20);
  });
  it('onTexteChange should cahnge the width ', () => {
    component.onWidthInputChange(500);
    expect(component.drawEllipseShape.attributes[0]).toBe(500);
    expect(component.currentBorderWidth).toEqual('500');
  });

  it('changeType changes the type of the rectangle correctly', () => {
    component.rectangleType = '';
    component.changeType();
    expect(component.activeBorder).toBe(true);
    expect(component.drawEllipseShape.attributes[1]).toEqual('');

    component.rectangleType = 'fill';
    component.changeType();
    expect(component.activeBorder).toBe(false);
    expect(component.drawEllipseShape.attributes[1]).toEqual('fill');
    expect(fixture.debugElement.query(By.css('.if'))).toBeNull(); // v/rifier si le ngif du html marche

    component.rectangleType = 'contour';
    component.changeType();
    expect(component.activeBorder).toBeTruthy();
    expect(component.drawEllipseShape.attributes[1]).toEqual('contour');
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

  it('focusOutValidation should only emit signal and not correct currentBorderWidth if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentBorderWidth = '5';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentBorderWidth).toEqual('5');
    expect(component.drawEllipseShape.attributes[0]).toEqual(5);
  });

  it('focusOutValidation should only emit signal and correct currentBorderWidth if its empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentBorderWidth = '';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentBorderWidth).toEqual('1');
    expect(component.drawEllipseShape.attributes[0]).toEqual(1);
  });

});
