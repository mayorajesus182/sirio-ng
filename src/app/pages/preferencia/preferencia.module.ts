import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { PreferenciaRoutingModule } from './preferencia.routing.module';



@NgModule({
  imports: [
    CommonModule,
    // Core
    SirioSharedModule,
    SharedComponentModule,
    BreadcrumbsModule,
    
    PreferenciaRoutingModule,
  ],
  declarations: [
  ],
  exports: []
})
export class PreferenciaModule {

}