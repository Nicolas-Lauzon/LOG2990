import { Injectable } from '@angular/core';

const DEFAULT_INTERVAL = 10;
const SECOND = 1000;

@Injectable({
  providedIn: 'root'
})
export class IntervalService {
  value: number;

  constructor() {
    this.value = DEFAULT_INTERVAL;
  }

 setInterval(spraysPerSeconde: number): void {
    this.value = SECOND / spraysPerSeconde;
  }

}
