import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { EmpresaRelacionadaFormPopupComponent } from './popup/empresa-relacionada-form.popup.component';
import { EmpresaRelacionadaTableComponent } from './table/empresa-relacionada-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FlexLayoutModule,
    // Core
    MaterialModule,
    SirioSharedModule,
    SharedComponentModule,
    BreadcrumbsModule
  ],
  declarations: [
    EmpresaRelacionadaFormPopupComponent,EmpresaRelacionadaTableComponent
  ],
  exports: [EmpresaRelacionadaTableComponent],
  entryComponents:[EmpresaRelacionadaFormPopupComponent]
})
export class EmpresaRelacionadaModule {

}