import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { AutorizacionRoutingModule } from './autorizacion.routing';


@NgModule({
  imports: [
    MaterialModule,
    // Core
    SirioSharedModule,
    SharedComponentModule,
    BreadcrumbsModule,

    AutorizacionRoutingModule
  ],

  declarations: [
  ],
  exports: []
})
export class AutorizacionModule {

}