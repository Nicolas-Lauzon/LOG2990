/* tslint:disable:no-unused-variable */
/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */

import { TestBed } from '@angular/core/testing';
import { DataService } from '../../data-service/data.service';
import { SAVE_KEY } from '../automatic-save.service';
import { LoadService } from './load.service';

describe('Service: Load', () => {
  let service: LoadService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadService, DataService]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(LoadService);
    window.localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('resetToolsIds should put all tools ids to zero ', () => {
    service.resetToolsIds();
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      expect(service.serviceTable[i].getCurrentId()).toEqual(0);
    }
  });

  it('setToolsIds should set all tools ids to their values ', () => {
    let testArray = [1, 1, 1, 1, 1, 1, 1, 1];
    service.setToolsIds(testArray);
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      expect(service.serviceTable[i].getCurrentId()).toEqual(1);
    }

    testArray = [1, 2, 3, 4, 5, 6, 7, 8];
    service.setToolsIds(testArray);
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      expect(service.serviceTable[i].getCurrentId()).toEqual(testArray[i]);
    }

  });

  it('setToolsIds should asve all tools IDs to storage ', () => {
    const keys = ['pencil', 'brush', 'spray', 'line', 'rect', 'ellip', 'polygon', 'bucket'];
    const myStorage = window.localStorage;
    let testArray = [1, 1, 1, 1, 1, 1, 1, 1];
    service.setToolsIds(testArray);
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      expect(myStorage.getItem(keys[i])).toBe('1');
    }

    testArray = [1, 2, 3, 4, 5, 6, 7, 8];
    service.setToolsIds(testArray);
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      expect(myStorage.getItem(keys[i])).toBe(testArray[i].toString());
    }
  });

  it('Load should only change all tools to zero if nothing is in storage', () => {
    const myStorage = window.localStorage;
    myStorage.clear();
    service.load();
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      expect(service.serviceTable[i].getCurrentId()).toEqual(0);
    }
  });

  it('Load should only change all tools to their saved values if there is no draw in storage', () => {
    const myStorage = window.localStorage;
    myStorage.clear();
    const keys = ['pencil', 'brush', 'spray', 'line', 'rect', 'ellip', 'polygon', 'bucket'];
    let testArray = [1, 1, 1, 1, 1, 1, 1, 1];
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      myStorage.setItem(keys[i], testArray[i].toString());
    }
    service.load();
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      expect(service.serviceTable[i].getCurrentId()).toEqual(testArray[i]);
    }

    testArray = [1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      myStorage.setItem(keys[i], testArray[i].toString());
    }
    service.load();
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      expect(service.serviceTable[i].getCurrentId()).toEqual(testArray[i]);
    }
  });

  it('Load should change currentDraw, dimensionX and DimensionY in data if there is one in storage', () => {
    const myStorage = window.localStorage;
    myStorage.clear();
    const keys = ['pencil', 'brush', 'spray', 'line', 'rect', 'ellip', 'polygon', 'bucket'];
    const testArray = [1, 1, 1, 1, 1, 1, 1, 1];
    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      myStorage.setItem(keys[i], testArray[i].toString());
    }
    myStorage.setItem(SAVE_KEY.DRAWING_CONTENT_KEY, 'test drawing');
    myStorage.setItem(SAVE_KEY.DRAWING_WIDTH_KEY, '100');
    myStorage.setItem(SAVE_KEY.DRAWING_HEIGHT_KEY, '50');
    service.load();
    let dataDrawing = '';
    service.automaticSave.data.drawCurrent.subscribe((message) => (dataDrawing = message));
    expect(dataDrawing).toEqual('test drawing');

    let dataDimensionX = 0;
    service.automaticSave.data.dimensionXCurrent.subscribe((message) => (dataDimensionX = message));
    expect(dataDimensionX).toEqual(100);

    let dataDimensionY = 0;
    service.automaticSave.data.dimensionYCurrent.subscribe((message) => (dataDimensionY = message));
    expect(dataDimensionY).toEqual(50);
  });

  it('setToolsIds should do nothing if the parameter is undefined', () => {
    const keys = ['pencil', 'brush', 'spray', 'line', 'rect', 'ellip', 'polygon', 'bucket'];
    const myStorage = window.localStorage;
    const testArray = [1, 1, 1, 1, 1, 1, 1, 1];
    service.setToolsIds(testArray);
    const tempArray: number[] = [];
    service.setToolsIds(tempArray);

    for (let i = 0 ; i < service.automaticSave.saveToolsIdsValues.length ; i++) {
      expect(myStorage.getItem(keys[i])).toBe('1');
    }
  });

});
