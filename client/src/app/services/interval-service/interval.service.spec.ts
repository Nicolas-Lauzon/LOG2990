/* tslint:disable:no-unused-variable */
/* tslint:disable:no-magic-numbers */
import { TestBed} from '@angular/core/testing';
import { IntervalService } from './interval.service';

describe('Service: Interval', () => {
  let service: IntervalService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [IntervalService]
  }));

  beforeEach(() => {
    service = TestBed.inject(IntervalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.value).toBe(10);
  });

  it('should set interval correctly', () => {
    service.setInterval(1000);
    expect(service.value).toBe(1);
  });
});
