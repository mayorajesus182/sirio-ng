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
import { AgenciaRoutingModule } from './agencia-routing.module';
import { CupoAgenciaPopupComponent } from './cupos/popup/cupo-agencia-popup.component';
import { CupoAgenciaTableComponent } from './cupos/table/cupo-agencia-table.component';

import { AgenciaDetailComponent } from './detail/agencia-detail.component';
import { AgenciaFormComponent } from './form/agencia-form.component';
import { AgenciaTableComponent } from './table/agencia-table.component';

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
        AgenciaRoutingModule
    ],
    declarations: [
        AgenciaFormComponent,
        AgenciaTableComponent,
        AgenciaDetailComponent,
        CupoAgenciaTableComponent,
        CupoAgenciaPopupComponent
    ],
    exports: [],
    entryComponents:[CupoAgenciaPopupComponent]
})

export class AgenciaModule {

}
