/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickColorComponent } from './quick-color.component';

describe('QuickColorComponent', () => {
  let component: QuickColorComponent;
  let fixture: ComponentFixture<QuickColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setQuickColor.emit called when mouseEvent.which= 1', () => {
    spyOn(component.setQuickColor, 'emit');
    const click: MouseEvent = new MouseEvent('mousedown', {clientX: 1 , clientY: 1, button: 0});
    component.onClick(click, 1);
    expect(component.setQuickColor.emit).toHaveBeenCalled();
  });

  it('setQuickColor.emit called when mouseEvent.which= 3', () => {
    spyOn(component.setQuickColor, 'emit');
    const click: MouseEvent = new MouseEvent('mousedown', {clientX: 1 , clientY: 1, button: 2});
    component.onClick(click, 1);
    expect(component.setQuickColor.emit).toHaveBeenCalled();
  });

  it('setQuickColor.emit called when mouseEvent.which= 5', () => {
    spyOn(component.setQuickColor, 'emit');
    const click: MouseEvent = new MouseEvent('mousedown', {clientX: 1 , clientY: 1, button: 3});
    const result = component.onClick(click, 1);
    expect(result).toBeFalsy();
  });

});
