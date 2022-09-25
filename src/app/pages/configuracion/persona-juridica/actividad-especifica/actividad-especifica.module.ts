
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
import { ActividadEspecificaRoutingModule } from './actividad-especifica-routing.module';
import { ActividadEspecificaDetailComponent } from './detail/actividad-especifica-detail.component';
import { ActividadEspecificaFormComponent } from './form/actividad-especifica-form.component';
import { ActividadEspecificaTableComponent } from './table/actividad-especifica-table.component';



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
        HighlightModule,
        SirioCardModule,
        ActividadEspecificaRoutingModule
    ],
    declarations: [
        ActividadEspecificaFormComponent,
        ActividadEspecificaTableComponent,
        ActividadEspecificaDetailComponent
    ],
    exports: [],
})

export class ActividadEspecificaModule {

}
