import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appGuideSwitch]'
})
export class GuideSwitchDirective {
  viewContainerRef: ViewContainerRef;

  constructor(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }
}
