// tslint:disable:no-magic-numbers
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule } from '@angular/material';
import { DataService } from 'src/app/services/data-service/data.service';
import { AttributesPencilComponent } from './attributes-pencil.component';

describe('AttributesPencilComponent', () => {
  let component: AttributesPencilComponent;
  let fixture: ComponentFixture<AttributesPencilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesPencilComponent ],
      imports: [ MatSliderModule ],
      providers: [ DataService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesPencilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.currentWidth).toBe(component.drawPencilTool.width.toString());
  });

  it('onSliderChange changes the pencil width and doesnt consider value of 0', () => {
    component.onWidthSliderChange(20);
    expect(component.currentWidth).toEqual('20');
    expect(component.drawPencilTool.width).toBe(20);
    component.onWidthSliderChange(0); // une valeur de 0 garde la derniere valeur
    expect(component.currentWidth).toEqual('20');
    expect(component.drawPencilTool.width).toBe(20);
  });

  it('onTexteChange should cahnge the width ', () => {
    component.onWidthInputChange(500);
    expect(component.drawPencilTool.width).toBe(500);
    expect(component.currentWidth).toEqual('500');
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
    expect(component.drawPencilTool.width).toEqual(5);
  });

  it('focusOutValidation should only emit signal and correct currentWidth if its empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.currentWidth = '';
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.currentWidth).toEqual('1');
    expect(component.drawPencilTool.width).toEqual(1);
  });
});
