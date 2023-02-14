import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { RecaudoRoutingModule } from './recaudo.routing';


@NgModule({
  imports: [
    CommonModule,
    SirioSharedModule,
    SharedComponentModule,
    BreadcrumbsModule,
    RecaudoRoutingModule
  ],
  declarations: [
  ],
  exports: []
})
export class RecaudoModule {

}