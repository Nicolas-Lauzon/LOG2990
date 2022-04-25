import { Component, ComponentFactoryResolver, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GuideSwitchDirective } from '../../../../directives/guide-switch/guide-switch.directive';
import { SidenavService } from '../../../../services/sidenav/sidenav.service';
import { GuideItem } from '../abstract-guide.component';
import { GuideComponent } from '../guide-component.component';
@Component({
  selector: 'app-global-guide',
  templateUrl: './global-guide.component.html',
  styleUrls: ['./global-guide.component.scss'],
})
export class GlobalGuideComponent implements OnInit, OnChanges {
    views: GuideItem[];
    viewIsChanged: boolean;
    @Input() viewIndex: number;
    @ViewChild(GuideSwitchDirective, { static: true })
    guideHost: GuideSwitchDirective;
    constructor(public componentFactoryResolver: ComponentFactoryResolver,
                public sidenavService: SidenavService) {
        this.viewIndex = 0;
        this.viewIsChanged = false;
        this.views = this.sidenavService.fullView;
    }

  ngOnInit(): void {
    this.loadComponent();

  }
  ngOnChanges(change: SimpleChanges): void {

    if (change.viewIndex) {
      this.sidenavService.toggleView(this.viewIndex);
      this.loadComponent();
    }
  }
  loadComponent(): void {
    const viewItem = this.views[this.viewIndex];

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(viewItem.component);

    const viewContainerRef = this.guideHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as GuideComponent).data = viewItem.data;
  }
}
