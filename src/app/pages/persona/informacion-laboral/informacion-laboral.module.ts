import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { LoadingOverlayModule } from 'src/@sirio/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { InformacionLaboralFormPopupComponent } from './popup/informacion-laboral-form.popup.component';
import { InformacionLaboralTableComponent } from './table/informacion-laboral-table.component';

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
    LoadingOverlayModule,
    BreadcrumbsModule
  ],
  declarations: [
    InformacionLaboralFormPopupComponent,InformacionLaboralTableComponent
  ],
  exports: [InformacionLaboralTableComponent],
  entryComponents:[InformacionLaboralFormPopupComponent]
})
export class InformacionLaboralModule {

}