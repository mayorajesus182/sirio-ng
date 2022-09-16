import { Directive } from '@angular/core';

@Directive({
  selector: '[sirioPageLayoutContent],sirio-page-layout-content',
  host: {
    class: 'sirio-page-layout-content'
  }
})
export class PageLayoutContentDirective {

  constructor() { }

}
