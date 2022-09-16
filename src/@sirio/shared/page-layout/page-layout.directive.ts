import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[sirioPageLayout],sirio-page-layout',
  host: {
    class: 'sirio-page-layout'
  }
})
export class PageLayoutDirective {

  @Input() mode: 'card' | 'simple' = 'simple';

  constructor() { }

  @HostBinding('class.sirio-page-layout-card')
  get isCard() {
    return this.mode === 'card';
  }

  @HostBinding('class.sirio-page-layout-simple')
  get isSimple() {
    return this.mode === 'simple';
  }

}
