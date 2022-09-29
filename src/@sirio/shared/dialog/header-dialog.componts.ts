
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from "@angular/core";



@Component({
  selector: 'sirio-dialog-header',
  styleUrls: ['./header-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'sirio-dialog-header' },
  template: `
      <div class="sirio-dialog-header-heading-group" >
        <ng-content select="sirio-dialog-header-heading"></ng-content>
        <ng-content select="sirio-dialog-header-subheading"></ng-content>
      </div>  `
})
export class SirioDialogHeader {
}


@Directive({
  selector: 'sirio-dialog-header-heading',
  host: { 'class': 'sirio-dialog-header-heading' }
})
export class SirioDialogHeaderTitle {
}

@Directive({
  selector: 'sirio-dialog-header-subheading',
  host: { 'class': 'sirio-dialog-header-subheading' }
})
export class SirioDialogHeaderSubTitle {
}