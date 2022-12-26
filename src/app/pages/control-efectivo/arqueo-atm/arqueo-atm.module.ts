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
import { ArqueoAtmRoutingModule } from './arqueo-atm-routing.module';
import { ArqueoAtmDetailPopupComponent } from './consulta/popup/arqueo-atm-detail-popup.component';
import { ArqueoAtmConsultaTableComponent } from './consulta/table/arqueo-atm-consulta-table.component';
import { ArqueoAtmFormComponent } from './form/arqueo-atm-form.component';
import { ArqueoAtmTableComponent } from './table/arqueo-atm-table.component';



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
        ArqueoAtmRoutingModule,
    ],
    declarations: [
        ArqueoAtmTableComponent,
        ArqueoAtmFormComponent,
        ArqueoAtmConsultaTableComponent,
        ArqueoAtmDetailPopupComponent,
        // AtmFormComponent,
        // AtmDetailComponent,
        // CajetinTableComponent,
    ],
    exports: [],
    entryComponents:[ArqueoAtmDetailPopupComponent]
})

export class ArqueoAtmModule {

}
