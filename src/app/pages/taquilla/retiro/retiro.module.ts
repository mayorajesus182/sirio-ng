import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { HighlightModule } from 'src/@sirio/shared/highlightjs/highlight.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { RetiroEfectivoFormComponent } from './efectivo/form/retiro-efectivo-form.component';
import { PagoChequeGerenciaFormComponent } from './pago-cheque-gerencia/form/pago-cheque-gerencia-form.component';
import { PagoChequeFormComponent } from './pago-cheque/form/pago-cheque-form.component';
import { RetiroRoutingModule } from './retiro-routing.module';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        FlexLayoutModule,
        MaterialModule,
        // Core
        SirioSharedModule,
        SharedComponentModule,
               
        HighlightModule,
        SirioCardModule,
        RetiroRoutingModule
    ],
    declarations: [
        RetiroEfectivoFormComponent,PagoChequeFormComponent,PagoChequeGerenciaFormComponent
      
      
    ],
    exports: [],
})

export class RetiroModule {

}
