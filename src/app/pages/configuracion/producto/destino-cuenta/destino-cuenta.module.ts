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
import { DestinoCuentaDetailComponent } from './detail/destino-cuenta-detail.component';
import { DestinoCuentaRoutingModule } from './detino-cuenta-routing.module';
import { DestinoCuentaFormComponent } from './form/destino-cuenta-form.component';
import { DestinoCuentaTableComponent } from './table/destino-cuenta-table.component';


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
        DestinoCuentaRoutingModule,
    ],
    declarations: [
        DestinoCuentaFormComponent,
        DestinoCuentaTableComponent,
        DestinoCuentaDetailComponent
    ],
    exports: [],
})

export class DestinoCuentaModule {

}
