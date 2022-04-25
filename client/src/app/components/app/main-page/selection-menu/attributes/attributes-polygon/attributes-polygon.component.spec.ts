// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule, MatSelectModule, MatSliderModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataService } from 'src/app/services/data-service/data.service';
import { DrawStrategyPolygonService } from 'src/app/services/draw-strategy/draw-strategy-polygon/draw-strategy-polygon.service';
import { AttributesPolygonComponent } from './attributes-polygon.component';

describe('AttributesPolygonComponent', () => {
  let component: AttributesPolygonComponent;
  let fixture: ComponentFixture<AttributesPolygonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesPolygonComponent ],
      imports: [MatSliderModule, MatFormFieldModule, MatSelectModule, BrowserAnimationsModule ],
      providers: [DrawStrategyPolygonService, DataService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesPolygonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.currentBorderWidth).toBe(component.drawPolygonShape.polygonParams.attributes[1].toString());
    expect(component.polygonType).toBe(component.drawPolygonShape.type);
  });

  it('onSliderChange changes the pencil width and doesnt consider value of 0', () => {
    component.onWidthSliderChange(20);
    expect(component.currentBorderWidth).toEqual('20');
    expect(component.drawPolygonShape.polygonParams.attributes[1]).toEqual(20);
    component.onWidthSliderChange(0);                  // une valeur de 0 garde la derniere valeur
    expect(component.currentBorderWidth).toEqual('20');
    expect(component.drawPolygonShape.polygonParams.attributes[1]).toBe(20);
  });
  it('onTexteChange should cahnge the width ', () => {
    component.onWidthInputChange(500);
    expect(component.drawPolygonShape.polygonParams.attributes[1]).toBe(500);
    expect(component.currentBorderWidth).toEqual('500');
  });

  it('changeType changes the type of the rectangle correctly', () => {
    component.polygonType = '';
    component.changeType();
    expect(component.activeBorder).toBe(true);
    expect(component.drawPolygonShape.type).toEqual('');

    component.polygonType = 'fill';
    component.changeType();
    expect(component.activeBorder).toBe(false);
    expect(component.drawPolygonShape.type).toEqual('fill');
    expect(fixture.debugElement.query(By.css('.if'))).toBeNull(); // v/rifier si le ngif du html marche

    component.polygonType = 'contour';
    component.changeType();
    expect(component.activeBorder).toBe(true);
    expect(component.drawPolygonShape.type).toEqual('contour');
  });

  it('onSideInputChange should cahnge the number of sides ', () => {
    component.onSideInputChange(500);
    expect(component.drawPolygonShape.polygonParams.attributes[0]).toBe(500);
    expect(component.sideNumber).toEqual(500);

    component.onSideInputChange(10);
    expect(component.drawPolygonShape.polygonParams.attributes[0]).toBe(10);
    expect(component.sideNumber).toEqual(10);

    component.onSideInputChange(3);
    expect(component.drawPolygonShape.polygonParams.attributes[0]).toBe(3);
    expect(component.sideNumber).toEqual(3);

    component.onSideInputChange(0);
    expect(component.drawPolygonShape.polygonParams.attributes[0]).toBe(0);
    expect(component.sideNumber).toEqual(0);

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

  it('focusOutValidation should only emit signal if sidenumber > 3', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.sideNumber = 3;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
  });

  it('focusOutValidation should emit signal and correct sidenumber to 3 if its too small', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.sideNumber = 2;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.sideNumber).toEqual(3);
    expect(component.drawPolygonShape.polygonParams.attributes[0]).toEqual(3);
  });

  it('focusOutValidation should only emit signal and not correct borderWidth if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentBorderWidth = '5';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentBorderWidth).toEqual('5');
    expect(component.drawPolygonShape.polygonParams.attributes[1]).toEqual(5);
  });

  it('focusOutValidation should only emit signal and correct borderWidth if its empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentBorderWidth = '';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentBorderWidth).toEqual('1');
    expect(component.drawPolygonShape.polygonParams.attributes[1]).toEqual(1);
  });

});
