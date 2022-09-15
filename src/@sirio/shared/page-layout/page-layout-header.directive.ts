import { Directive } from '@angular/core';

@Directive({
  selector: '[furyPageLayoutHeader],sirio-page-layout-header',
  host: {
    class: 'sirio-page-layout-header'
  }
})
export class PageLayoutHeaderDirective {

  constructor() { }

}

