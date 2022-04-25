import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { DataService } from 'src/app/services/data-service/data.service';
import { AttributesBucketComponent } from './attributes-bucket.component';
// tslint:disable: no-magic-numbers

describe('AttributesBucketComponent', () => {
  let component: AttributesBucketComponent;
  let fixture: ComponentFixture<AttributesBucketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesBucketComponent ],
      imports: [ MatSliderModule, MatSlideToggleModule ],
      providers: [DataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('onToleranceChange should change the value of the tolerance to the value in parameters', () => {
    component.onToleranceChange(50);
    expect(component.tolerance).toEqual(50);
    expect(component.bucketService.tolerance).toEqual(50);
  });
  it('onToleranceChangeInput should change the value of the tolerance to the value in parameters', () => {
    component.onToleranceChangeInput('50');
    expect(component.tolerance).toEqual(50);
    expect(component.bucketService.tolerance).toEqual(50);
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
  it('focusOutValidation should only emit signal if tolerance is between maxTolerance and minTolerance', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.tolerance = 5;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.tolerance).toEqual(5);
    expect(component.bucketService.tolerance).toEqual(5);
  });
  it('focusOutValidation should only emit signal and correct tolerance if its too small or empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.tolerance = -10;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.tolerance).toEqual(0);
    expect(component.bucketService.tolerance).toEqual(0);
  });
  it('focusOutValidation should only emit signal and correct tolerance if its too big or empty', () => {
    const test = spyOn(component.outFocus, 'emit');
    component.tolerance = 120;
    component.focusOutValidation();
    expect(test).toHaveBeenCalled();
    expect(component.tolerance).toEqual(100);
    expect(component.bucketService.tolerance).toEqual(100);
  });
});
