/* tslint:disable:no-unused-variable */
// tslint:disable: no-string-literal

import { TestBed } from '@angular/core/testing';
import { DataService } from '../data-service/data.service';
import { DrawInvokerService } from './draw-invoker.service';

describe('Service: DrawInvoker', () => {
  let service: DrawInvokerService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawInvokerService, DataService]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DrawInvokerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('do called and command.length === 0, return', () => {
    const tester: [string, string, string][] = [];
    service.do(tester);
    expect(service.do).toEqual(service.do);
  });

  it('reset called and command.length === 0, return', () => {
    const tester: [string, string, string][] = [];
    service.do(tester);
    service.reset();
    expect(service['done'].length).toEqual(0);
  });

  it('do called and command[0][0] === selectedZone, return', () => {
    const tester: [string, string, string][] = [];
    tester.push(['selectedZone', 'hello', 'greetings']);
    service.do(tester);
    expect(service.do).toEqual(service.do);
  });

  it('do called with 3 tests, undo called and undoneCommand !== undefined, drawingService.replaceTag called. Call redo after', () => {
    const test1: [string, string, string][] = [];
    const test2: [string, string, string][] = [];
    const test3: [string, string, string][] = [];
    test1.push(['notSelectedZone', 'hello', 'greetings']);
    test2.push(['notSelectedZone2', 'hello2', 'greetings2']);
    test3.push(['notSelectedZone3', 'hello3', 'greetings3']);
    service.do(test1);
    service.do(test2);
    service.do(test3);
    service.undo();
    service.redo();
    expect(service.nDone).toEqual(service['done'].length);
  });

});
