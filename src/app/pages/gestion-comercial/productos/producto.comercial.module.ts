import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { ScrollbarModule } from 'src/@sirio/shared/scrollbar/scrollbar.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { ProductosPersonaTableComponent } from './table/productos-persona-table.component';
import { ProductoCuentaRegistroFormPopupComponent } from './popup/cuenta_bancaria/producto-cuenta-registro-form.popup.component';
import { ProductoCuentaDataFormPopupComponent } from './popup/cuenta_bancaria/producto-cuenta-data-form.popup.component';
import { ProductoPlazoFijoDataFormPopupComponent } from './popup/plazo_fijo/producto-plazofijo-data-form.popup.component';
import { ProductoTDCDataFormPopupComponent } from './popup/tdc/producto-tdc-data-form.popup.component';
import { ProductoTDCSolicitudFormPopupComponent } from './popup/tdc/producto-tdc-solicitud-form.popup.component';

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
    SirioCardModule,
    ScrollbarModule,
    
    DragDropModule,
    BreadcrumbsModule
  ],
  declarations: [
    ProductoCuentaRegistroFormPopupComponent,
    ProductoCuentaDataFormPopupComponent,
    ProductoPlazoFijoDataFormPopupComponent,
    ProductoTDCDataFormPopupComponent,
    ProductoTDCSolicitudFormPopupComponent,
    ProductosPersonaTableComponent,
  ],
  exports: [ProductosPersonaTableComponent],
  entryComponents:[ProductoCuentaRegistroFormPopupComponent, ProductoCuentaDataFormPopupComponent, ProductoPlazoFijoDataFormPopupComponent,
    ProductoTDCDataFormPopupComponent, ProductoTDCSolicitudFormPopupComponent]
})
export class ProductoComercialModule {

}