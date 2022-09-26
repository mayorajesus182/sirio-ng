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
import { PromedioTransaccionDetailComponent } from './detail/promedio-transaccion-detail.component';
import { PromedioTransaccionFormComponent } from './form/promedio-transaccion-form.component';
import { PromedioTransaccionRoutingModule } from './promedio-transaccion-routing.module';
import { PromedioTransaccionTableComponent } from './table/promedio-transaccion-table.component';

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
        PromedioTransaccionRoutingModule
    ],
    declarations: [
        PromedioTransaccionFormComponent,
        PromedioTransaccionTableComponent,
        PromedioTransaccionDetailComponent
    ],
    exports: [],
})

export class PromedioTransaccionModule {

}
