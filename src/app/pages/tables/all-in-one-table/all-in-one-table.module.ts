import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { BreadcrumbsModule } from '../../../../@sirio/shared/breadcrumbs/breadcrumbs.module';
import { MaterialModule } from '../../../../@sirio/shared/material-components.module';
import { AllInOneTableRoutingModule } from './all-in-one-table-routing.module';
import { AllInOneTableComponent } from './all-in-one-table.component';
import { CustomerCreateUpdateModule } from './customer-create-update/customer-create-update.module';

@NgModule({
  imports: [
    CommonModule,
    AllInOneTableRoutingModule,
    FormsModule,
    MaterialModule,
    CustomerCreateUpdateModule,
    // Core
    SirioSharedModule,
    SharedComponentModule,
    BreadcrumbsModule
  ],
  declarations: [AllInOneTableComponent],
  exports: [AllInOneTableComponent]
})
export class AllInOneTableModule {
}
