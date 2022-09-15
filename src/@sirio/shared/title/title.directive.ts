import { Directive } from '@angular/core';

@Directive({
  selector: '[furyTitle],sirio-title',
  host: {
    class: 'sirio-title'
  }
})
export class TitleDirective {

  constructor() { }

}
