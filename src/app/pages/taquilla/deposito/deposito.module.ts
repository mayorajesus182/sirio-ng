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
import { DepositoFormComponent } from './form/deposito-form.component';
import { DepositoRoutingModule } from './deposito-routing.module';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { DepositoEfectivoFormComponent } from './deposito-efectivo/deposito-efectivo-form.component';
import { DepositoChequeFormComponent } from './deposito-cheques/deposito-cheques-form.component';
import { DepositoMixtoFormComponent } from './deposito-mixto/deposito-mixto-form.component';



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
        DepositoRoutingModule
    ],
    declarations: [
        DepositoFormComponent,
        DepositoEfectivoFormComponent,
        DepositoChequeFormComponent,
        DepositoMixtoFormComponent,
      
      
    ],
    exports: [],
    providers:[ { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }]
})

export class DepositoModule {

}
