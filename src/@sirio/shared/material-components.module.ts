import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { DateAdapter, ErrorStateMatcher, MatNativeDateModule, MatRippleModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IMaskDirectiveModule, IMaskModule } from 'angular-imask';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { NgxMaskModule } from 'ngx-mask';

import { NgxSpinnerModule } from 'ngx-spinner';
import { AutofocusDirective } from './input/autofocus.directive';
import { NumAccountValidator } from './input/cuenta-validation.directive';
import { EmailValidate } from './input/email-validation.directive';
import { SirioErrorStateMatcher } from './input/error-state-matcher';
import { MinorAgeValidator } from './input/minAge-validation.directive';
import { TelefonoValidator } from './input/phone-validation.directive';
import { RifValidator } from './input/rif-validation.directive';
import { UppercaseDirective } from './input/uppercase.directive';
import { ExcerptPipe } from './pipes/excerpt.pipe';
import { RelativeTimePipe } from './pipes/relative-time.pipe';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { ShortSizePipe } from './pipes/short-size.pipe';
import { AgeValidatorByDocumentType } from './input/age-validation-bydocumenttype.directive';
import { StringPadDirective } from './input/string-pad.directive';
import { MatTreeModule } from '@angular/material/tree';
import { DisableZoomDirective } from './screen/zoom-disable.directive';
import { DocNumberValidateDirective } from './input/document-validate.directive';
import { TabNavigationDirective } from './form/tab-navigation.directive';
import { ListFilterPipe } from './pipes/list-filter.pipe';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 13
		},
		vertical: {
			position: 'top',
			distance: 66,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 7000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};


export const customCurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  allowZero: false,
  decimal: ",",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ".",
  nullable: true
};


export const DATE_FORMATS_CUSTOM = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMM YYYY',
  },
};

const toInclude = [
  DisableZoomDirective,
  DocNumberValidateDirective,
  AutofocusDirective,
  NumAccountValidator,
  RifValidator,
  MinorAgeValidator,
  AgeValidatorByDocumentType,
  EmailValidate,
  TelefonoValidator,
  StringPadDirective,
  UppercaseDirective,
  TabNavigationDirective,
  RelativeTimePipe,
  ShortNumberPipe,
  ShortSizePipe,
  ExcerptPipe,
  ListFilterPipe,
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    SweetAlert2Module.forRoot(),

    NotifierModule.withConfig(customNotifierOptions),
  ],
  exports: [
    MatInputModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatMenuModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatRippleModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatStepperModule,
    FlexLayoutModule,
    MatDividerModule,
    MatBadgeModule,
    MatChipsModule,
    MatExpansionModule,
    // MatMomentDateModule,
    MatFormFieldModule,
    // MatExpansionModule,
    // MatMomentDateModule,
    MatTreeModule,
    // MatBottomSheetModule,
    NgxSpinnerModule,
    NgxDatatableModule,
    // NgxMatSelectSearchModule,
    CurrencyMaskModule,
    NgxMaskModule,
    IMaskDirectiveModule,
    IMaskModule,
    SweetAlert2Module,
    NotifierModule,
    NgbAlertModule,
    toInclude
  ],
  
  declarations: toInclude,
  

  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: CURRENCY_MASK_CONFIG, useValue: customCurrencyMaskConfig },
    { provide: MAT_DATE_LOCALE, useValue: 'es-VE' },
    { provide: LOCALE_ID, useValue: 'es-VE' },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS_CUSTOM },
    { provide: ErrorStateMatcher, useClass: SirioErrorStateMatcher }
    // { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
})
export class MaterialModule {
}
