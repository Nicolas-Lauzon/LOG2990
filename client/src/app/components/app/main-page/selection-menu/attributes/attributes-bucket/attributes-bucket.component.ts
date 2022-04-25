import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DrawStrategyBucketService } from 'src/app/services/draw-strategy/draw-strategy-bucket/draw-strategy-bucket.service';

@Component({
  selector: 'app-attributes-bucket',
  templateUrl: './attributes-bucket.component.html',
  styleUrls: ['./attributes-bucket.component.scss']
})
export class AttributesBucketComponent implements OnInit {
  tolerance: number;
  bucketService: DrawStrategyBucketService;
  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  constructor(bucketService: DrawStrategyBucketService) {
    this.focus = new EventEmitter();
    this.outFocus = new EventEmitter();
    this.tolerance = 0;
    this.bucketService = bucketService;
  }

  ngOnInit(): void {
    this.tolerance = this.bucketService.tolerance;
  }
  onToleranceChange(value: number): void {
    if (value >= 0) {
      this.tolerance = value;
      this.bucketService.tolerance = this.tolerance;
    }
  }
  onToleranceChangeInput(value: string): void {
    this.tolerance = parseInt(value, undefined);

    this.bucketService.tolerance = parseInt(value, undefined);

  }

  onKeypress(event: KeyboardEvent): boolean {
    const regex = new RegExp('^[0-9]');
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    } else { return true; }
  }

  focusOutValidation(): void {
    const minTolerance = 0;
    const maxTolerance = 100;
    this.tolerance = (this.tolerance < minTolerance) ? minTolerance : this.tolerance;
    this.tolerance = (this.tolerance > maxTolerance) ? maxTolerance : this.tolerance;
    this.bucketService.tolerance = this.tolerance;

    this.outFocus.emit();
  }
}
