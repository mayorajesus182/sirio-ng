import { Directive } from '@angular/core';

@Directive({
  selector: '[sirioPage],sirio-page',
  host: {
    class: 'sirio-page'
  }
})
export class PageDirective {

  constructor() { }

}
