// The factory used to generate the component return data with the any type
/* tslint:disable:no-magic-numbers */
import { LayoutModule } from '@angular/cdk/layout';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './main-nav.component';

describe('MainNavComponent', () => {
    let component: MainNavComponent;
    let fixture: ComponentFixture<MainNavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MainNavComponent],
            imports: [
                NoopAnimationsModule,
                LayoutModule,
                MatButtonModule,
                MatIconModule,
                MatListModule,
                MatSidenavModule,
                MatToolbarModule,
                MatMenuModule,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainNavComponent);
        component = fixture.componentInstance;
        component.toggleView(4);
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(component).toBeTruthy();
    });

    it('should call increaseIndex', () => {
        const compiled = fixture.debugElement.nativeElement;
        compiled.querySelector('#nextButton').click();
        expect(component.viewIndex).toEqual(5);
        expect(component.panelOpenState[0]).toEqual(true);
    });
    it('should call decreaseIndex', () => {
        const compiled = fixture.debugElement.nativeElement;
        compiled.querySelector('#previousButton').click();
        expect(component.viewIndex).toEqual(3);
    });
    it('should call toggleview', (done) => {
        const aLink = fixture.debugElement.queryAll(By.css('a'));
        const aToggle: HTMLButtonElement = aLink[0].nativeElement;
        spyOn(component, 'toggleView');
        aToggle.click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(component.toggleView).toHaveBeenCalled();
            done();
        });
    });
    it('should test panelState', () => {
        component.toggleView(0);
        // tslint:disable-next-line: no-string-literal
        component['panelState']();
        expect(component.panelOpenState[0]).toEqual(false);
        expect(component.panelOpenState[1]).toEqual(false);
        expect(component.panelOpenState[2]).toEqual(false);

        component.toggleView(13);
        // tslint:disable-next-line: no-string-literal
        component['panelState']();
        expect(component.panelOpenState[0]).toEqual(false);
        expect(component.panelOpenState[1]).toEqual(false);
        expect(component.panelOpenState[2]).toEqual(true);

        component.toggleView(10);
        // tslint:disable-next-line: no-string-literal
        component['panelState']();
        expect(component.panelOpenState[0]).toEqual(false);
        expect(component.panelOpenState[1]).toEqual(false);
        expect(component.panelOpenState[2]).toEqual(true);

        component.toggleView(7);
        // tslint:disable-next-line: no-string-literal
        component['panelState']();
        expect(component.panelOpenState[0]).toEqual(true);
        expect(component.panelOpenState[1]).toEqual(true);
        expect(component.panelOpenState[2]).toEqual(false);
    });
});
