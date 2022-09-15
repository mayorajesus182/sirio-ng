import { Directive } from '@angular/core';

@Directive({
  selector: '[furyPageLayoutContent],sirio-page-layout-content',
  host: {
    class: 'sirio-page-layout-content'
  }
})
export class PageLayoutContentDirective {

  constructor() { }

}
