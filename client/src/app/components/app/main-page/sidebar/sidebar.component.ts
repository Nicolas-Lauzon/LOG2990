import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DrawInvokerService } from 'src/app/services/draw-invoker-service/draw-invoker.service';
import { DrawStrategySelectionService } from 'src/app/services/draw-strategy/draw-strategy-selection/draw-strategy-selection.service';
import { IconState } from '../icon-state';
import { SIDEBAR_ICON_INDEX } from './../../../../enums';

export enum SERVICE_INDEX {
  SELECTIONSERVICE_INDEX = 0,
  DRAWINGINVOKER_INDEX = 1
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  services: [DrawStrategySelectionService , DrawInvokerService];
  @Input() iconState: (IconState[])[];
  @Output() selectedSidebar: EventEmitter<number>;
  @Output() createNewDrawing: EventEmitter<boolean>;
  @Output() exportDrawing: EventEmitter<boolean>;
  @Output() saveDrawing: EventEmitter<boolean>;
  @Output() showGallery: EventEmitter<boolean>;

  constructor(drawingInvoker: DrawInvokerService, selection: DrawStrategySelectionService) {
    this.iconState = [[new IconState(), new IconState(), new IconState(), new IconState(),
      new IconState(), new IconState(), new IconState()], [new IconState(), new IconState(), new IconState(),
          new IconState()],
         [new IconState(), new IconState(), new IconState(),
          new IconState()]];
    this.selectedSidebar = new EventEmitter<number>();
    this.createNewDrawing = new EventEmitter<boolean>();
    this.saveDrawing = new EventEmitter<boolean>();
    this.exportDrawing = new EventEmitter<boolean>();
    this.showGallery = new EventEmitter<boolean>();
    this.services = [ selection, drawingInvoker];
  }

  SIDEBAR_ICON_INDEX(): typeof SIDEBAR_ICON_INDEX {
    return SIDEBAR_ICON_INDEX;
  }

}
