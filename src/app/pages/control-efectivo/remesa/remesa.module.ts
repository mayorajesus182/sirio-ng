
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
import { SolicitudRemesaDetailComponent } from './detail/solicitud-remesa-detail.component';
import { DespacharRemesaFormComponent } from './form/despachar/despachar-remesa-form.component';
import { ProcesarRemesaFormComponent } from './form/procesar/procesar-remesa-form.component';
import { RecibirRemesaFormComponent } from './form/recibir/recibir-remesa-form.component';
import { SolicitudRemesaFormComponent } from './form/solicitud/solicitud-remesa-form.component';
import { RemesaRoutingModule } from './remesa-routing.module';
import { SolicitudRemesaTableComponent } from './table/solicitud-remesa-table.component';


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
        RemesaRoutingModule,
    ],
    declarations: [
        SolicitudRemesaTableComponent,
        SolicitudRemesaFormComponent,
        SolicitudRemesaDetailComponent,
        DespacharRemesaFormComponent,
        ProcesarRemesaFormComponent,
        RecibirRemesaFormComponent,
    ],
    exports: [],
})

export class RemesaModule {

}