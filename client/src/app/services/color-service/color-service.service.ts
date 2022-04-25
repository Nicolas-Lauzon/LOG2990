import { Injectable } from '@angular/core';

const N_RECENT_COLOR = 10;

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  primaryColor: string;
  transparencyPrimaryColor: string;
  secondaryColor: string;
  transparencySecondaryColor: string;
  backgroundColor: string;
  recentColors: string[] = new Array<string>();
  private hexConversionMap: Map<number, string> = new Map<number, string>();

  constructor() {
    this.primaryColor  = '#000000';
    this.transparencyPrimaryColor  = 'ff';
    this.secondaryColor  = '#000000';
    this.transparencySecondaryColor = 'ff';
    this.backgroundColor = '#000000FF';
    for (let i = 0; i < N_RECENT_COLOR; i++) {
      this.recentColors.push(this.primaryColor);
    }

    let j = 0;
    this.hexConversionMap.set(j++, '0');
    this.hexConversionMap.set(j++, '1');
    this.hexConversionMap.set(j++, '2');
    this.hexConversionMap.set(j++, '3');
    this.hexConversionMap.set(j++, '4');
    this.hexConversionMap.set(j++, '5');
    this.hexConversionMap.set(j++, '6');
    this.hexConversionMap.set(j++, '7');
    this.hexConversionMap.set(j++, '8');
    this.hexConversionMap.set(j++, '9');
    this.hexConversionMap.set(j++, 'a');
    this.hexConversionMap.set(j++, 'b');
    this.hexConversionMap.set(j++, 'c');
    this.hexConversionMap.set(j++, 'd');
    this.hexConversionMap.set(j++, 'e');
    this.hexConversionMap.set(j++, 'f');
  }

  setPrimaryTransparancy(transparency: number): void {
    const multiplier = 2.55;
    const base255 = transparency * multiplier;
    this.transparencyPrimaryColor = this.stringToHex(base255);
  }

  setSecondaryTransparancy(transparency: number): void {
    const multiplier = 2.55;
    const base255 = transparency * multiplier;
    this.transparencySecondaryColor = this.stringToHex(base255);
  }

  getPrimaryColor(): string {
    return this.primaryColor + this.transparencyPrimaryColor;
  }

  getSecondaryColor(): string {
    return this.secondaryColor + this.transparencySecondaryColor;
  }

  switchColors(): void {
    const tempColor = this.primaryColor;
    this.primaryColor = this.secondaryColor;
    this.secondaryColor = tempColor;
  }

  setPrimary(color: string): void {
    this.primaryColor = color;
    this.updateRecentColors(color);
  }

  setSecondary(color: string): void {
    this.secondaryColor = color;
    this.updateRecentColors(color);
  }

  updateRecentColors(color: string): void {

    const tempRecentColors: string[] = new Array<string>();

    for (const recentColor of this.recentColors) {
      tempRecentColors.push(recentColor);
    }

    for (let i = 0; i < N_RECENT_COLOR - 1; i++) {
      if (tempRecentColors[i] === color) {
        break;
      }
      this.recentColors[i + 1] = tempRecentColors[i];
    }

    this.recentColors[0] = color;
  }

  stringToHex(n: number): string {
    const maxHex = 15;
    let str = '';
    let temp = 0;
    n = Math.floor(n);
    while (n > maxHex) {
      n -= maxHex + 1;
      temp++;
    }
    str += this.getCharacter(temp) + this.getCharacter(n);
    return str;
  }

  private getCharacter(n: number): string {
    return this.hexConversionMap.get(n) as string;
  }

  getColorFromArray(array: Uint8ClampedArray): string {
    const color = '#' + this.stringToHex(array[0]) + this.stringToHex(array[1]) + this.stringToHex(array[2]);
    return color;
  }
}
