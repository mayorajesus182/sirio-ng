import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { OrganizacionRoutingModule } from './organizacion.routing';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    // Core
    SirioSharedModule,
    SharedComponentModule,
    BreadcrumbsModule,

    OrganizacionRoutingModule
  ],
  declarations: [
  ],
  exports: []
})
export class OrganizacionModule {

}