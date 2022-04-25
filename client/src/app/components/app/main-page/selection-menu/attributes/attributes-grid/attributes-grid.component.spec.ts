import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { DataService } from './../../../../../../services/data-service/data.service';

import { AttributesGridComponent } from './attributes-grid.component';
/* tslint:disable: no-magic-numbers */
/* tslint:disable: no-string-literal */

describe('AttributesGridComponent', () => {
  let component: AttributesGridComponent;
  let fixture: ComponentFixture<AttributesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesGridComponent],
      imports: [ MatSliderModule, MatSlideToggleModule ],
      providers: [DataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesGridComponent);
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

  it('focusOutValidation should only emit signal and not correct transparency if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.transparency = 15;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.transparency).toEqual(15);
    expect(component.grid.transparency).toEqual(0.15);
  });

  it('focusOutValidation should only emit signal and not correct transparency if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.transparency = 15;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.transparency).toEqual(15);
    expect(component.grid.transparency).toEqual(0.15);
  });

  it('onGridToggle, activateGrid and showGrid called', () => {
    spyOn(component.grid, 'activateGrid' as never);
    spyOn(component.grid, 'showGrid' as never);
    component.onGridToggle();
    expect(component.grid.activateGrid).toHaveBeenCalled();
    expect(component.grid.showGrid).toHaveBeenCalled();
  });

  it('onTransparencyChange and value!=0, makeGrid and showGrid called', () => {
    spyOn(component.grid, 'makeGrid' as never);
    spyOn(component.grid, 'showGrid' as never);
    component.onTransparencyChange(1);
    expect(component.grid.makeGrid).toHaveBeenCalled();
    expect(component.grid.showGrid).toHaveBeenCalled();

  });
  it('onTransparencyChange and value == 0, showGrid called', () => {

    spyOn(component.grid, 'showGrid' as never);
    component.onTransparencyChange(0);
    expect(component.grid.showGrid).toHaveBeenCalled();

  });

  it('onSizeChange and value!=0 and grid.isActive, makeGrid and showGrid called', () => {
    spyOn(component.grid, 'makeGrid' as never);
    spyOn(component.grid, 'showGrid' as never);
    spyOn(component.grid, 'isActive' as never).and.returnValue(true as never);
    component.onSizeChange(1);
    expect(component.grid.makeGrid).toHaveBeenCalled();
    expect(component.grid.showGrid).toHaveBeenCalled();
  });
  it('onSizeChange and value == 0 and grid.isActive, showGrid called', () => {
    spyOn(component.grid, 'showGrid' as never);
    spyOn(component.grid, 'isActive' as never).and.returnValue(true as never);
    component.onSizeChange(0);
    expect(component.grid.showGrid).toHaveBeenCalled();
  });
  it('onSizeChange and value != 0 and !grid.isActive, showGrid called', () => {
    spyOn(component.grid, 'makeGrid' as never);
    component.grid.isActive = false;
    component.onSizeChange(1);
    expect(component.grid.makeGrid).toHaveBeenCalled();
  });

  it('onSizeChangeInput and grid.isActive, makeGrid and showGrid called', () => {
    spyOn(component.grid, 'makeGrid' as never);
    spyOn(component.grid, 'showGrid' as never);
    spyOn(component.grid, 'isActive' as never).and.returnValue(true as never);
    component.onSizeChangeInput('10');
    expect(component.grid.makeGrid).toHaveBeenCalled();
    expect(component.grid.showGrid).toHaveBeenCalled();
  });
  it('onSizeChangeInput and grid.isActive, makeGrid and showGrid called', () => {
    spyOn(component.grid, 'makeGrid' as never);
    component.grid.isActive = false;
    component.onSizeChangeInput('10');
    expect(component.grid.makeGrid).toHaveBeenCalled();
  });

  it('onTransparencyChangeInput, makeGrid and showGrid called', () => {
    spyOn(component.grid, 'makeGrid' as never);
    spyOn(component.grid, 'showGrid' as never);
    component.onTransparencyChangeInput(1);
    expect(component.grid.makeGrid).toHaveBeenCalled();
    expect(component.grid.showGrid).toHaveBeenCalled();
  });

  it('focusOutValidation should only emit signal and not correct size if value is good', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.size = 15;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.size).toEqual(15);
    expect(component.grid.size).toEqual(15);
  });

  it('focusOutValidation should only emit signal and correct transparency if its too small or empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.size = 0;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.size).toEqual(5);
    expect(component.grid.size).toEqual(5);
  });

  it('focusOutValidation should only emit signal and correct transparency if its too small or empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.transparency = 0;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.transparency).toEqual(10);
    expect(component.grid.transparency).toEqual(0.1);
  });
});
