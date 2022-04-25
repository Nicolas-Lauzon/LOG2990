import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DrawStrategySelectionService } from 'src/app/services/draw-strategy/draw-strategy-selection/draw-strategy-selection.service';
import { IconState } from '../icon-state';
import { COLOR_ICON_INDEX, DRAWING_ICON_INDEX, SHAPE_ICON_INDEX, SIDEBAR_ICON_INDEX, TOOLS_INDEX } from './../../../../enums';
@Component({
  selector: 'app-selection-menu',
  templateUrl: './selection-menu.component.html',
  styleUrls: ['./selection-menu.component.css']
})

export class SelectionMenuComponent {
  @Input() index: number[];
  @Input() iconState: (IconState[])[];
  @Output() selectedDrawTool: EventEmitter<number>;
  @Output() selectedShapeTool: EventEmitter<number>;
  @Output() selectedColorTool: EventEmitter<number>;
  @Output() focus: EventEmitter<boolean>;
  @Output() outFocus: EventEmitter<boolean>;

  selectionService: DrawStrategySelectionService;

  constructor(selectionService: DrawStrategySelectionService) {
    this.selectedDrawTool = new EventEmitter<number>();
    this.selectedShapeTool = new EventEmitter<number>();
    this.selectedColorTool = new EventEmitter<number>();
    this.iconState = [[new IconState(), new IconState(), new IconState(), new IconState()
      ],  [new IconState(), new IconState(), new IconState(),
        new IconState()],
         [new IconState(), new IconState(), new IconState(),
          new IconState()],
        [new IconState(), new IconState(), new IconState()]];
    this.focus = new EventEmitter();
    this.outFocus = new EventEmitter();
    this.index = [0, 0];
    this.selectionService = selectionService;
  }

  SIDEBAR_ICON_INDEX(): typeof SIDEBAR_ICON_INDEX {
    return SIDEBAR_ICON_INDEX;
  }
  DRAWING_ICON_INDEX(): typeof DRAWING_ICON_INDEX {
    return DRAWING_ICON_INDEX;
  }
  SHAPE_ICON_INDEX(): typeof SHAPE_ICON_INDEX {
    return SHAPE_ICON_INDEX;
  }
  TOOLS_INDEX(): typeof TOOLS_INDEX {
    return TOOLS_INDEX;
  }
  COLOR_ICON_INDEX(): typeof COLOR_ICON_INDEX {
    return COLOR_ICON_INDEX;
  }

}
