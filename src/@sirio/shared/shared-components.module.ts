import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { ActionsNavComponent } from './actions/actions-nav.component';
import { AuditBarComponent } from './audit-bar/audit-bar.component';
import { FormBaseComponent } from './base/form-base.component';
import { PopupBaseComponent } from './base/popup-base.component';
import { TableBaseComponent } from './base/table-base.component';
import { ButtonAddComponent } from './button-add/button-add.component';
import { SirioDialogHeader, SirioDialogHeaderSubTitle, SirioDialogHeaderTitle } from './dialog/header-dialog.componts';
import { IdleWarningComponent } from './idle-snack/idle-warning.component';
import { ListSimpleComponent } from './list/list-simple.component ';
import { ListComponent } from './list/list.component';
import { MaterialModule } from './material-components.module';
import { SelectSearchComponent } from './select/select-search.component';
import { SelectSimpleComponent } from './select/select-simple.component';
import { TooltipModule } from './tooltip/tooltip.module';



const components = [
  SelectSearchComponent,
  SelectSimpleComponent,
  ListComponent,
  ListSimpleComponent,
  ButtonAddComponent,
  AuditBarComponent,
  ActionsNavComponent,
  IdleWarningComponent,
  SirioDialogHeader,
  SirioDialogHeaderSubTitle,
  SirioDialogHeaderTitle,
  FormBaseComponent,
  PopupBaseComponent,
  TableBaseComponent
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    TooltipModule,
    NgxMatSelectSearchModule
  ],
  
declarations: components,
  exports: components
})
export class SharedComponentModule {
  
}
