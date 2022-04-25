import { Injectable } from '@angular/core';
import { AutomaticSaveService } from '../automatic-save-service/automatic-save.service';
import { DrawingService } from '../drawing-service/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class DrawInvokerService {

  private done: [string, string, string][][];
  private undone: [string, string, string][][];
  private drawingService: DrawingService;

  nDone: number;
  nUndone: number;
  private automaticSave: AutomaticSaveService;

constructor(drawingService: DrawingService, automaticSave: AutomaticSaveService) {
  this.drawingService = drawingService;
  this.done = [];
  this.undone = [];
  this.nDone = 0;
  this.nUndone = 0;
  this.automaticSave = automaticSave;
}

do(command: [string, string, string][]): void {
  if (command.length === 0) {
    return;
  } else if (command.length === 1) {
    this.automaticSave.undoRedoSave();
    if (command[0][0] === 'selectedZone') {
      return;
    }
  }

  this.done.push(command);
  const saveIds: [string, string][] = [];
  command.forEach((subCommand) => {
    this.drawingService.replaceTag([subCommand[0], subCommand[1]]);
    const key = subCommand[0].replace(/[0-9]/g, '');
    let value = subCommand[0].replace(/[a-zA-Z]/g, '');
    const intValue = parseInt(value, undefined) + 1;
    value = intValue.toString();
    saveIds.push([key, value]);
  });
  this.undone = [];
  this.nDone = this.done.length;
  this.nUndone = this.undone.length;
  this.automaticSave.toolModificationSave(saveIds);

}

undo(): void {
  const undoneCommand = this.done.pop();
  if (undoneCommand !== undefined) {

    undoneCommand.forEach((subCommand) => {
      this.drawingService.replaceTag([subCommand[0], subCommand[2]]);
    });
    this.undone.push(undoneCommand);
  }
  this.nDone = this.done.length;
  this.nUndone = this.undone.length;
  this.automaticSave.undoRedoSave();
}

redo(): void {
  const redoneCommand = this.undone.pop();
  if ( redoneCommand !== undefined) {

    redoneCommand.forEach((subCommand) => {
      this.drawingService.replaceTag([subCommand[0], subCommand[1]]);
    });
    this.done.push(redoneCommand);
  }
  this.nDone = this.done.length;
  this.nUndone = this.undone.length;
  this.automaticSave.undoRedoSave();
}

reset(): void {
  this.done = [];
  this.undone = [];
  this.nDone = 0;
  this.nUndone = 0;
}

}
