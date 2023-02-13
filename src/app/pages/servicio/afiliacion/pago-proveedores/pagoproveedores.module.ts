import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { pagoproveedoresRoutingModule } from '../pago-proveedores/pagoproveedores.routing';
import { DepositoFormComponent } from './form/pago-proveedores.component';
import { DepositoEfectivoFormComponent } from './cuenta-proveedor/cuenta-proveedor-form.component';
import { TelefonoFormPopupComponent } from './popup/telefono-form.popup.component';
import { HighlightModule } from 'src/@sirio/shared/highlightjs/highlight.module';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';

@NgModule({
  imports: [
    CommonModule,
    SirioSharedModule,
    SharedComponentModule,
    BreadcrumbsModule,
    pagoproveedoresRoutingModule,
    FlexLayoutModule,
    FormsModule,
    TranslateModule,
    MaterialModule,
    ReactiveFormsModule,   
        HighlightModule,
        SirioCardModule,
 
  ],
  declarations: [
    DepositoFormComponent,
    DepositoEfectivoFormComponent,
    TelefonoFormPopupComponent,
  
  ],
  exports: []
})
export class pagoproveedoresModule {

}