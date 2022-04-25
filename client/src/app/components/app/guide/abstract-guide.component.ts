import { Type } from '@angular/core';

export class GuideItem {
    // The factory used to generate the component return data with the any type
    /* tslint:disable:no-any */
    constructor(public component: Type<any>, public data: any) {}
}
