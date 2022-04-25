import { Injectable } from '@angular/core';
import { GuideExportDrawingComponent } from 'src/app/components/app/guide/guide-files/guide-export-drawing/guide-export-drawing.component';
import { GuideSaveDrawingComponent } from 'src/app/components/app/guide/guide-files/guide-save-drawing/guide-save-drawing.component';
import { GuideGalleryComponent } from 'src/app/components/app/guide/guide-tools/guide-gallery/guide-gallery.component';
import { GuideGridComponent } from 'src/app/components/app/guide/guide-utilities/guide-grid/guide-grid.component';
import { GuideSelectionComponent } from 'src/app/components/app/guide/guide-utilities/guide-selection/guide-selection.component';
import { GuideUndoRedoComponent } from 'src/app/components/app/guide/guide-utilities/guide-undo-redo/guide-undo-redo.component';
import { GuideItem } from '../../components/app/guide/abstract-guide.component';
import { GuideColorToolsComponent } from '../../components/app/guide/guide-tools/guide-color-tools/guide-color-tools.component';
import { GuideColorComponent } from '../../components/app/guide/guide-tools/guide-color/guide-color.component';
import { GuideBrushesComponent } from '../../components/app/guide/guide-tools/guide-draw-tools/guide-draw-tools.component';
import { GuideDrawingViewComponent } from '../../components/app/guide/guide-tools/guide-drawing-view/guide-drawing-view.component';
import { GuideNewDrawingComponent } from '../../components/app/guide/guide-tools/guide-new-drawing/guide-new-drawing.component';
import { GuideShapesComponent } from '../../components/app/guide/guide-tools/guide-shapes/guide-shapes.component';
import { GuideWelcomeComponent } from '../../components/app/guide/guide-welcome/guide-welcome.component';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  views: GuideItem[];
  maxIndex: number;
  viewIndex: number;
  constructor() {
    this.maxIndex = 0;
    this.viewIndex = 0;
    this.views = [
      new GuideItem(GuideWelcomeComponent, {}),
      new GuideItem(GuideDrawingViewComponent, {}),
      new GuideItem(GuideBrushesComponent, {}),
      new GuideItem(GuideShapesComponent, {}),
      new GuideItem(GuideColorToolsComponent, {}),
      new GuideItem(GuideColorComponent, {}),

      new GuideItem(GuideSelectionComponent, {}),
      new GuideItem(GuideGridComponent, {}),
      new GuideItem(GuideUndoRedoComponent, {}),
      new GuideItem(GuideNewDrawingComponent, {}),
      new GuideItem(GuideGalleryComponent, {}),
      new GuideItem(GuideSaveDrawingComponent, {}),
      new GuideItem(GuideExportDrawingComponent, {}),
    ];
    this.maxIndex = this.views.length;
  }

  toggleView(index: number): void {
    this.viewIndex = index;
  }
  increaseIndex(): void {
    if (this.viewIndex <= this.maxIndex - 2) {
      this.viewIndex++;
    }
  }
  decreaseIndex(): void {
    if (this.viewIndex > 0) {
      this.viewIndex--;
    }
  }

  get fullView(): GuideItem[] {
    return this.views;
  }
}
