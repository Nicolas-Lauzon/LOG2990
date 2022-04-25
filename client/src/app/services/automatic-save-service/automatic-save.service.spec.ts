/* tslint:disable:no-unused-variable */
/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */

import { TestBed } from '@angular/core/testing';
import { DataService } from '../data-service/data.service';
import { AutomaticSaveService, /*, SAVE_KEY*/
SAVE_KEY} from './automatic-save.service';

describe('Service: AutomaticSave', () => {
  let service: AutomaticSaveService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutomaticSaveService, DataService]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AutomaticSaveService);
    window.localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('undoRedoSave should change drawing in storage with the current drawing', () => {
    const myStorage = window.localStorage;
    const mainFrame = document.createElement('div');
    mainFrame.innerHTML = 'test';
    service.elRef = mainFrame;
    service.undoRedoSave();
    expect(myStorage.getItem(SAVE_KEY.DRAWING_CONTENT_KEY)).toEqual('test');
  });

  it('undoRedoSave should do nothing if there is no active drawing', () => {
    const myStorage = window.localStorage;
    service.undoRedoSave();
    expect(myStorage.getItem(SAVE_KEY.DRAWING_CONTENT_KEY)).toBe(null);
  });

  it('toolModificationSave should only change tool id in storage if there is no active drawing', () => {
    const myStorage = window.localStorage;

    service.toolModificationSave([['pencil', '10']]);
    expect(myStorage.getItem(SAVE_KEY.DRAWING_CONTENT_KEY)).toBe(null);
    expect(myStorage.getItem('pencil')).toEqual('10');
  });

  it('toolModificationSave should change drawing in storge and change tool id in storage if active drawing isnt null', () => {
    const myStorage = window.localStorage;
    const mainFrame = document.createElement('div');
    mainFrame.innerHTML = 'test';
    service.elRef = mainFrame;
    service.toolModificationSave([['pencil', '10']]);
    expect(myStorage.getItem(SAVE_KEY.DRAWING_CONTENT_KEY)).toEqual('test');
    expect(myStorage.getItem('pencil')).toEqual('10');
  });

  it('firstSave should take drawCurrent, dimensionXCurrent and dimensionYCurrent and put them in storage', () => {
    const myStorage = window.localStorage;
    service.data.changeDraw('draw');
    service.data.changeDimensionX(100);
    service.data.changeDimensionY(50);

    service.firstSave();
    expect(myStorage.getItem(SAVE_KEY.DRAWING_CONTENT_KEY)).toEqual('draw');
    expect(myStorage.getItem(SAVE_KEY.DRAWING_WIDTH_KEY)).toEqual('100');
    expect(myStorage.getItem(SAVE_KEY.DRAWING_HEIGHT_KEY)).toEqual('50');
  });
});
