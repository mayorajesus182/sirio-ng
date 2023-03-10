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
import { CreditoInformacionFormPopupComponent } from './popup/credito-informacion-form.popup.component';
import { CreditosPersonaTableComponent } from './table/creditos-persona-table.component';
import { CreditoDataFormPopupComponent } from './popup/credito-data-form.popup.component';

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
    CreditoInformacionFormPopupComponent,
    CreditosPersonaTableComponent,
    CreditoDataFormPopupComponent,
  ],
  exports: [CreditosPersonaTableComponent],
  entryComponents:[CreditoInformacionFormPopupComponent, CreditoDataFormPopupComponent]
})
export class CreditoComercialModule {

}