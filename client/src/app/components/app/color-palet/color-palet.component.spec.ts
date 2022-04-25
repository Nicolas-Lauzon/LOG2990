/* tslint:disable:no-unused-variable */
// tslint:disable: no-string-literal
// tslint:disable: max-line-length

import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPaletComponent } from './color-palet.component';
describe('ColorPaletComponent', () => {
  let component: ColorPaletComponent;
  let fixture: ComponentFixture<ColorPaletComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorPaletComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPaletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const inputRed = document.createElement('input');
    inputRed.setAttribute('id', 'redText');
    (component.topWindowRef.nativeElement as HTMLElement).appendChild(inputRed);

    const inputGreen = document.createElement('input');
    inputGreen.setAttribute('id', 'greenText');
    (component.topWindowRef.nativeElement as HTMLElement).appendChild(inputGreen);

    const inputBlue = document.createElement('input');
    inputBlue.setAttribute('id', 'blueText');
    (component.topWindowRef.nativeElement as HTMLElement).appendChild(inputBlue);

    const rainbowCanvas = document.createElement('canvas');
    rainbowCanvas.setAttribute('id', 'rainbowCanvas');
    (component.topWindowRef.nativeElement as HTMLElement).appendChild(rainbowCanvas);

    const blackWhiteCanvas = document.createElement('canvas');
    blackWhiteCanvas.setAttribute('id', 'blackWhiteCanvas');
    (component.topWindowRef.nativeElement as HTMLElement).appendChild(blackWhiteCanvas);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onKeypress returns false when an incorrect value is entered', () => {

    const key: KeyboardEvent = new KeyboardEvent('keydown', { key: 'w' });

    expect(component.onKeypress(key)).toEqual(false);
  });
  it('updateStrings modifies correctly the currentColor', () => {
    component.currentColor = '#abcdef';
    component['updateStrings']();

    expect(component['colorRGB'][0]).toEqual('ab');
    expect(component['colorRGB'][1]).toEqual('cd');
    expect(component['colorRGB'][2]).toEqual('ef');
  });

  it('updateCurrentColorFromCanvas changes the current color', () => {
    const click = new MouseEvent('mouseDown', { clientX: 50, clientY: 250 });
    component['updateCurrentColorFromCanvas'](click, (component.topWindowRef.nativeElement as HTMLElement).querySelector('#rainbowCanvas') as HTMLCanvasElement);
    const colorRed = component['stringToHex']((((component.topWindowRef.nativeElement as HTMLElement).querySelector('#rainbowCanvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D)
                     .getImageData(click.offsetX, click.offsetY, 1, 1).data[0]);
    expect(component['colorRGB'][0]).toEqual(colorRed);

  });

  it('mouseUpRGBA update tous les elements', () => {
    const click = new MouseEvent('mouseUp', { clientX: 50, clientY: 250 });
    component.mouseUpRGBA(click);
    const colorRed = component['stringToHex']((((component.topWindowRef.nativeElement as HTMLElement).querySelector('#rainbowCanvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D)
                     .getImageData(click.offsetX, click.offsetY, 1, 1).data[0]);
    expect(component['colorRGB'][0]).toEqual(colorRed);

  });

  it('mouseUpBlackWhite update tous les elements', () => {
    const click = new MouseEvent('mouseUp', { clientX: 50, clientY: 250 });
    component.mouseUpBlackWhite(click);
    const colorRed = component['stringToHex']((((component.topWindowRef.nativeElement as HTMLElement).querySelector('#blackWhiteCanvas') as HTMLCanvasElement).getContext('2d') as CanvasRenderingContext2D)
                   .getImageData(click.offsetX, click.offsetY, 1, 1).data[0]);
    expect(component['colorRGB'][0]).toEqual(colorRed);

  });

  it('getColorString retourne la bonne string', () => {
    component['colorRGB'][0] = 'dd';
    component['colorRGB'][1] = 'ee';
    component['colorRGB'][2] = 'ff';
    expect(component.getColorString()).toEqual('#ddeeff');

  });

  it("ngOnChange est appele lors d'un changement", () => {

    component.currentColor = '#aaaaaa';
    component.ngOnChanges({
      currentColor: new SimpleChange(null, component.currentColor, true)
    });
    fixture.detectChanges();
    expect(component['colorRGB'][0]).toEqual('aa');
    expect(component['colorRGB'][1]).toEqual('aa');
    expect(component['colorRGB'][2]).toEqual('aa');

  });

  it('setCurrentColor sets correctly the current color', () => {
    component.setCurrentColor('#aaaaaa');
    expect(component.currentColor).toEqual('#aaaaaa');
  });
  it('emitColor emits the current color', () => {
    spyOn(component.setColor, 'emit');
    component.emitColor();

    expect(component.setColor.emit).toHaveBeenCalled();

  });

  it('onKeypress returns true when a correct value is entered', () => {

    const key: KeyboardEvent = new KeyboardEvent('keypress', { key: 'a' });

    expect(component.onKeypress(key)).toEqual(true);
  });

  it('onInput works', () => {

    spyOn(component, 'updateTransparenceColor' as never);
    ((component.topWindowRef.nativeElement as HTMLElement).querySelector('#redText') as HTMLInputElement).value = 'a';
    ((component.topWindowRef.nativeElement as HTMLElement).querySelector('#greenText') as HTMLInputElement).value = 'b';
    ((component.topWindowRef.nativeElement as HTMLElement).querySelector('#blueText') as HTMLInputElement).value = 'c';

    ((component.topWindowRef.nativeElement as HTMLElement).querySelector('#redText') as HTMLInputElement).dispatchEvent(new Event('input'));

    expect(component['updateTransparenceColor']).toHaveBeenCalled();

  });
  it('onInput works', () => {

    spyOn(component, 'updateCurrentColorFromCanvas' as never);
    spyOn(component, 'updateTransparenceColor' as never);
    const move = new MouseEvent('mousemove', { clientX: 60, clientY: 300 });

    component.onClickCanvas();
    component.onMoveRGBA(move);
    expect(component['updateCurrentColorFromCanvas']).toHaveBeenCalled();
    expect(component['updateTransparenceColor']).toHaveBeenCalled();
  });
  it('onInput works', () => {

    spyOn(component, 'updateCurrentColorFromCanvas' as never);
    const move = new MouseEvent('mousemove', { clientX: 60, clientY: 300 });

    component.onClickCanvas();
    component.onMoveBlackWhite(move);
    expect(component['updateCurrentColorFromCanvas']).toHaveBeenCalled();

    component.isClicked = false;
    const coordonate = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    component.onMoveBlackWhite(coordonate);
  });

});
