import { ChangeDetectionStrategy, Component, Directive, Input, ViewEncapsulation } from '@angular/core';

// noinspection TsLint
@Component({
  selector: 'sirio-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  host: { 'class': 'sirio-card' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuryCard {
}

// noinspection TsLint
@Component({
  selector: 'sirio-card-header',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'sirio-card-header' },
  template: `
    <div class="sirio-card-header-heading-group">
      <ng-content select="sirio-card-header-heading"></ng-content>
      <ng-content select="sirio-card-header-subheading"></ng-content>
    </div>
    <ng-content></ng-content>
    <ng-content select="sirio-card-header-actions"></ng-content>
  `
})
export class FuryCardHeader {
}

// noinspection TsLint
@Component({
  selector: 'sirio-card-content',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'sirio-card-content' },
  template: `
    <ng-content></ng-content>`
})
export class FuryCardContent {
}

// noinspection TsLint
@Directive({
  selector: 'sirio-card-header-heading',
  host: { 'class': 'sirio-card-header-heading' }
})
export class FuryCardHeaderTitle {
}

// noinspection TsLint
@Directive({
  selector: 'sirio-card-header-subheading',
  host: { 'class': 'sirio-card-header-subheading' }
})
export class FuryCardHeaderSubTitle {
}

// noinspection TsLint
@Directive({
  selector: 'sirio-card-header-actions',
  host: { 'class': 'sirio-card-header-actions' }
})
export class FuryCardHeaderActions {
}

// noinspection TsLint
@Directive({
  selector: 'sirio-card-actions',
  host: {
    'class': 'sirio-card-actions',
    '[class.sirio-card-actions-align-end]': 'align === "end"',
  }
})
export class FuryCardActions {
  /** Position of the actions inside the card. */
  @Input() align: 'start' | 'end' = 'start';
}
