import { Directive } from '@angular/core';

@Directive({
  selector: '[sirioTitle],sirio-title',
  host: {
    class: 'sirio-title'
  }
})
export class TitleDirective {

  constructor() { }

}
