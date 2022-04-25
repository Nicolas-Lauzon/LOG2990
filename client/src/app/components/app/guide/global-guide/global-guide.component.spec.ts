import { Component, CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { GuideItem } from 'src/app/components/app/guide/abstract-guide.component';
import { GuideSwitchDirective } from 'src/app/directives/guide-switch/guide-switch.directive';
import { SidenavService } from 'src/app/services/sidenav/sidenav.service';
import { GlobalGuideComponent } from './global-guide.component';

@Component({
    selector: 'mock-component',
    template: '<mst-on-changes-child [num]="1"></mst-on-changes-child>',
})
class MockComponent {}

describe('GlobalGuideComponent', () => {
    let component: GlobalGuideComponent;

    let fixture: ComponentFixture<GlobalGuideComponent>;
    const fakeViewTab: GuideItem[] = [new GuideItem(MockComponent, {})];

    beforeEach(async(() => {
        const spySidenavService = jasmine.createSpyObj({
            getViews: fakeViewTab,
            toggleView: () => {
                return;
            },
        });
        TestBed.configureTestingModule({
            declarations: [GlobalGuideComponent, MockComponent, GuideSwitchDirective],
            providers: [{ provide: SidenavService, useValue: spySidenavService }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [MockComponent] } })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GlobalGuideComponent);

        component = fixture.componentInstance;
        component.views = fakeViewTab;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('calling loadComponent in the ngOnChange', () => {
        // tslint:disable-next-line:no-magic-numbers
        component.viewIndex = 5;
        fixture.detectChanges();
        spyOn(component, 'loadComponent');
        component.ngOnChanges({
            viewIndex: new SimpleChange(null, component.viewIndex, true),
        });
        fixture.detectChanges();
        expect(component.loadComponent).toHaveBeenCalled();
    });
});
