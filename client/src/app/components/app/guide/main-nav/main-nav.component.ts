import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SidenavService } from '../../../../services/sidenav/sidenav.service';

const VALUE_SELECTION = 6;
const VALUE_SAVE = 9;

@Component({
    selector: 'main-nav',
    templateUrl: './main-nav.component.html',
    styleUrls: ['./main-nav.component.scss'],
    providers: [SidenavService],
})
export class MainNavComponent {
    panelOpenState: boolean[];
    sidenavService: SidenavService;
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
        map((result) => result.matches),
        shareReplay(),
    );

    constructor(private breakpointObserver: BreakpointObserver, sidenavService: SidenavService) {
        this.panelOpenState = [false, false, false];
        this.sidenavService = sidenavService;
    }

    private panelState(): void {
        if (this.viewIndex < VALUE_SELECTION) {
            this.panelOpenState[0] = true;
            this.panelOpenState[2] = false;
            this.panelOpenState[1] = false;
        }
        if (this.viewIndex === 0) {
            this.panelOpenState[0] = false;
            this.panelOpenState[1] = false;
            this.panelOpenState[2] = false;
        }
        if (this.viewIndex >= VALUE_SELECTION && this.viewIndex < VALUE_SAVE) {
            this.panelOpenState[1] = true;
            this.panelOpenState[2] = false;
            this.panelOpenState[0] = true;
        }
        if (this.viewIndex >= VALUE_SAVE) {
            this.panelOpenState[2] = true;
            this.panelOpenState[0] = false;
            this.panelOpenState[1] = false;
        }
    }
    toggleView(index: number): void {
        this.sidenavService.toggleView(index);
        this.panelState();
    }
    increaseIndex(): void {
        this.sidenavService.increaseIndex();
        this.panelState();
    }
    decreaseIndex(): void {
        this.sidenavService.decreaseIndex();
        this.panelState();
    }
    get viewIndex(): number {
        return this.sidenavService.viewIndex;
    }
}
