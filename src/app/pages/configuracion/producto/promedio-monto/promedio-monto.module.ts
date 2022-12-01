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
import { PromedioMontoDetailComponent } from './detail/promedio-monto-detail.component';
import { PromedioMontoFormComponent } from './form/promedio-monto-form.component';
import { PromedioMontoRoutingModule } from './promedio-monto-routing.module';
import { PromedioMontoTableComponent } from './table/promedio-monto-table.component';



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
        PromedioMontoRoutingModule,
    ],
    declarations: [
        PromedioMontoFormComponent,
        PromedioMontoTableComponent,
        PromedioMontoDetailComponent
    ],
    exports: [],
})

export class PromedioMontoModule {

}
