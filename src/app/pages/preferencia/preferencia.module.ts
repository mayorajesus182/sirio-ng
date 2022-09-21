import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { HighlightModule } from 'src/@sirio/shared/highlightjs/highlight.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { IdiomaModule } from './idioma/idioma.module';
import { PreferenciaRoutingModule } from './preferencia.routing.module';



@NgModule({
  imports: [
    CommonModule,
    IdiomaModule,
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