import { Directive } from '@angular/core';

@Directive({
  selector: '[sirioPageLayoutHeader],sirio-page-layout-header',
  host: {
    class: 'sirio-page-layout-header'
  }
})
export class PageLayoutHeaderDirective {

  constructor() { }

}

