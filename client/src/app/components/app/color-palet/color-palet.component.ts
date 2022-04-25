import {
  AfterViewInit, Component, ElementRef, EventEmitter,
  Input, OnChanges, Output, SimpleChanges, ViewChild
} from '@angular/core';
const N_COLORS = 3;
@Component({
  selector: 'app-color-palet',

  templateUrl: './color-palet.component.html',
  styleUrls: ['./color-palet.component.css'],
})

export class ColorPaletComponent implements AfterViewInit, OnChanges {
  @Input() currentColor: string;
  colorRGB: string[];
  isClicked: boolean;
  @ViewChild('topWindow', { static: false })
  topWindowRef: ElementRef;

  @Output() setColor: EventEmitter<string>;
  @Output() cancel: EventEmitter<unknown>;
  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor() {
    this.currentColor = '#FFFFFF';
    this.isClicked = false;
    this.colorRGB = new Array<string>(N_COLORS).fill('FF');

    this.setColor = new EventEmitter();
    this.cancel = new EventEmitter();
    this.focus = new EventEmitter();
    this.outFocus = new EventEmitter();
  }

  setCurrentColor(color: string): void {
    this.currentColor = color;
  }

  ngOnChanges(change: SimpleChanges): void {
      if (change.currentColor) {
        this.updateTransparenceColor();
        this.updateStrings();
      }
  }

  emitColor(): void {
    this.setColor.emit(this.currentColor);
  }

  ngAfterViewInit(): void {

    const rainbowCanvas = ((this.topWindowRef.nativeElement as HTMLElement).querySelector('#rainbowCanvas') as HTMLCanvasElement);
    const blackWhiteCanvas = ((this.topWindowRef.nativeElement as HTMLElement).querySelector('#blackWhiteCanvas') as HTMLCanvasElement);
    const rainbowContext: CanvasRenderingContext2D = rainbowCanvas.getContext('2d') as CanvasRenderingContext2D;
    const blackWhiteContext: CanvasRenderingContext2D = blackWhiteCanvas.getContext('2d') as CanvasRenderingContext2D;

    const rainbowGrd: CanvasGradient = rainbowContext.createLinearGradient(0, 0, 0, rainbowCanvas.height);
    const blackWhiteGrd: CanvasGradient = blackWhiteContext.createLinearGradient(0, 0, 0, blackWhiteCanvas.height);
    let colorStop = 0;
    const incrementFactor = 0.165;
    rainbowGrd.addColorStop(colorStop, 'rgb(255, 0, 0)');
    colorStop += incrementFactor;
    rainbowGrd.addColorStop(colorStop, 'rgb(255, 0, 255)');
    colorStop += incrementFactor;
    rainbowGrd.addColorStop(colorStop, 'rgb(0, 0, 255)');
    colorStop += incrementFactor;
    rainbowGrd.addColorStop(colorStop, 'rgb(0, 255, 255)');
    colorStop += incrementFactor;
    rainbowGrd.addColorStop(colorStop, 'rgb(0, 255, 0)');
    colorStop += incrementFactor;
    rainbowGrd.addColorStop(colorStop, 'rgb(255, 255, 0)');
    colorStop += incrementFactor;
    rainbowGrd.addColorStop(1, 'rgb(255, 0, 0)');

    blackWhiteGrd.addColorStop(0.0, 'black');
    blackWhiteGrd.addColorStop(1 / 2, 'grey');
    blackWhiteGrd.addColorStop(1, 'white');

    rainbowContext.fillStyle = rainbowGrd;
    rainbowContext.fillRect(0, 0, rainbowCanvas.width, rainbowCanvas.height);

    blackWhiteContext.fillStyle = blackWhiteGrd;
    blackWhiteContext.fillRect(0, 0, blackWhiteCanvas.width, blackWhiteCanvas.height);

    this.updateTransparenceColor();
  }

  onKeypress(event: KeyboardEvent): boolean {
    const regex = new RegExp('^[a-fA-F0-9]');
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    } else { return true; }
  }

  onInput(): void {
    let tempCurrentColorRed = ((this.topWindowRef.nativeElement as HTMLElement).querySelector('#redText') as HTMLInputElement).value;
    let tempCurrentColorGreen = ((this.topWindowRef.nativeElement as HTMLElement).querySelector('#greenText') as HTMLInputElement).value;
    let tempCurrentColorBlue = ((this.topWindowRef.nativeElement as HTMLElement).querySelector('#blueText') as HTMLInputElement).value;

    if (tempCurrentColorRed.length < 2) {
      tempCurrentColorRed = '0' + tempCurrentColorRed;
    }
    if (tempCurrentColorGreen.length < 2) {
      tempCurrentColorGreen = '0' + tempCurrentColorGreen;
    }
    if (tempCurrentColorBlue.length < 2) {
      tempCurrentColorBlue = '0' + tempCurrentColorBlue;
    }

    this.currentColor = '#' + tempCurrentColorRed + tempCurrentColorGreen + tempCurrentColorBlue;
    this.updateTransparenceColor();
  }

  private updateStrings(): void {
    const redStart = 1;
    const redEnd = 3;
    const greenStart = 3;
    const greenEnd = 5;
    const blueStart = 5;
    const blueEnd = 7;
    this.colorRGB[0] = this.currentColor.substring(redStart, redEnd);
    this.colorRGB[1] = this.currentColor.substring(greenStart, greenEnd);
    this.colorRGB[2] = this.currentColor.substring(blueStart, blueEnd);
  }

  private updateTransparenceColor(): void {
    if (this.topWindowRef !== undefined) {
      const blackWhiteCanvas = ((this.topWindowRef.nativeElement as HTMLElement).querySelector('#blackWhiteCanvas') as HTMLCanvasElement);
      const blackWhiteContext = blackWhiteCanvas.getContext('2d') as CanvasRenderingContext2D;
      const whiteGrd: CanvasGradient = blackWhiteContext.createLinearGradient(0, 0, 0, blackWhiteCanvas.height);
      const blackGrd: CanvasGradient = blackWhiteContext.createLinearGradient(0, 0, blackWhiteCanvas.width, 0);

      whiteGrd.addColorStop(0.0, 'rgba(255,255,255,1)');
      whiteGrd.addColorStop(1, 'rgba(255,255,255,0)');

      blackGrd.addColorStop(0.0, 'rgba(0,0,0,1)');
      blackGrd.addColorStop(1, 'rgba(0,0,0,0)');

      blackWhiteContext.fillStyle = this.currentColor;
      blackWhiteContext.fillRect(0, 0, blackWhiteCanvas.width, blackWhiteCanvas.height);

      blackWhiteContext.fillStyle = whiteGrd;
      blackWhiteContext.fillRect(0, 0, blackWhiteCanvas.width, blackWhiteCanvas.height);

      blackWhiteContext.fillStyle = blackGrd;
      blackWhiteContext.fillRect(0, 0, blackWhiteCanvas.width, blackWhiteCanvas.height);
    }
  }

  private updateCurrentColorFromCanvas(event: MouseEvent, canvas: HTMLCanvasElement): void {
    const x: number = event.offsetX;
    const y: number = event.offsetY;
    const data: Uint8ClampedArray = (canvas.getContext('2d') as CanvasRenderingContext2D).getImageData(x, y, 1, 1).data;
    this.colorRGB[0] = this.stringToHex(data[0]);
    this.colorRGB[1] = this.stringToHex(data[1]);
    this.colorRGB[2] = this.stringToHex(data[2]);
    this.currentColor = '#' + this.colorRGB[0] + this.colorRGB[1] + this.colorRGB[2];
  }

  getColorString(): string {
    return '#' + this.colorRGB[0] + this.colorRGB[1] + this.colorRGB[2];
  }

  onMoveRGBA(event: MouseEvent): void {
    const elem = (this.topWindowRef.nativeElement as HTMLElement);
    if (this.isClicked) {
      this.updateCurrentColorFromCanvas(event, elem.querySelector('#rainbowCanvas') as HTMLCanvasElement);
      this.updateTransparenceColor();
    }
  }

  onMoveBlackWhite(event: MouseEvent): void {
    const elem = (this.topWindowRef.nativeElement as HTMLElement);
    if (this.isClicked) {
      this.updateCurrentColorFromCanvas(event, elem.querySelector('#blackWhiteCanvas') as HTMLCanvasElement);
    }
  }

  mouseUpRGBA(event: MouseEvent): void {
    this.isClicked = false;
    const x: number = event.offsetX;
    const y: number = event.offsetY;
    const data: Uint8ClampedArray = (((this.topWindowRef.nativeElement as HTMLElement).querySelector('#rainbowCanvas') as HTMLCanvasElement)
    .getContext('2d') as CanvasRenderingContext2D).getImageData(x, y, 1, 1).data;
    this.colorRGB[0] = this.stringToHex(data[0]);
    this.colorRGB[1] = this.stringToHex(data[1]);
    this.colorRGB[2] = this.stringToHex(data[2]);
    this.currentColor = '#' + this.colorRGB[0] + this.colorRGB[1] + this.colorRGB[2];
    this.updateTransparenceColor();
    this.updateStrings();
  }

  mouseUpBlackWhite(event: MouseEvent): void {
    const elem = (this.topWindowRef.nativeElement as HTMLElement);
    this.isClicked = false;
    const x: number = event.offsetX;
    const y: number = event.offsetY;
    const data: Uint8ClampedArray = ((elem.querySelector('#blackWhiteCanvas') as HTMLCanvasElement)
    .getContext('2d') as CanvasRenderingContext2D).getImageData(x, y, 1, 1).data;
    this.colorRGB[0] = this.stringToHex(data[0]);
    this.colorRGB[1] = this.stringToHex(data[1]);
    this.colorRGB[2] = this.stringToHex(data[2]);
    this.currentColor = '#' + this.colorRGB[0] + this.colorRGB[1] + this.colorRGB[2];
    this.updateStrings();
  }

  onClickCanvas(): void {
    this.isClicked = true;
  }

  private stringToHex(n: number): string {
    let str = '';
    let temp = 0;
    n = Math.floor(n);
    const hexaMax = 15;
    const hexaReduction = 16;
    while (n > hexaMax) {
      n -= hexaReduction;
      temp++;
    }
    str += this.getCharacter(temp) + this.getCharacter(n);
    return str;
  }

  private getCharacter(n: number): string {

    const hexConversionMap: Map<number, string> = new Map<number, string>();

    let i = 0;
    hexConversionMap.set(i++, '0');
    hexConversionMap.set(i++, '1');
    hexConversionMap.set(i++, '2');
    hexConversionMap.set(i++, '3');
    hexConversionMap.set(i++, '4');
    hexConversionMap.set(i++, '5');
    hexConversionMap.set(i++, '6');
    hexConversionMap.set(i++, '7');
    hexConversionMap.set(i++, '8');
    hexConversionMap.set(i++, '9');
    hexConversionMap.set(i++, 'a');
    hexConversionMap.set(i++, 'b');
    hexConversionMap.set(i++, 'c');
    hexConversionMap.set(i++, 'd');
    hexConversionMap.set(i++, 'e');
    hexConversionMap.set(i++, 'f');
    return hexConversionMap.get(n) as string;
  }

}
