import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { IdiomaModule } from './idioma/idioma.module';
import { PreferenciaRoutingModule } from './preferencia.routing.module';



@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    IdiomaModule,
    // Core
    SirioSharedModule,
    SharedComponentModule,
    BreadcrumbsModule,
    PreferenciaRoutingModule
  ],
  declarations: [
  ],
  exports: []
})
export class PreferenciaModule {

}