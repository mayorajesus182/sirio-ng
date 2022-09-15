import { Directive } from '@angular/core';

@Directive({
  selector: '[furyPage],sirio-page',
  host: {
    class: 'sirio-page'
  }
})
export class PageDirective {

  constructor() { }

}
