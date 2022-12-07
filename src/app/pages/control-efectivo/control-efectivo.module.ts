import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { TooltipModule } from 'src/@sirio/shared/tooltip/tooltip.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { ControlEfectivoRoutingModule } from './control-efectivo.routing';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    SirioSharedModule,
    SharedComponentModule,
    BreadcrumbsModule,
    TooltipModule,
    ControlEfectivoRoutingModule
  ],
  declarations: [
  ],
  exports: []
})
export class ControlEfectivoModule {

}