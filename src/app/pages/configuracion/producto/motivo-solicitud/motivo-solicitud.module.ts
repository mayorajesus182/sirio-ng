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
import { MotivoSolicitudDetailComponent } from './detail/motivo-solicitud-detail.component';
import { MotivoSolicitudFormComponent } from './form/motivo-solicitud-form.component';
import { MotivoSolicitudRoutingModule } from './motivo-solicitud-routing.module';
import { MotivoSolicitudTableComponent } from './table/motivo-solicitud-table.component';

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
        MotivoSolicitudRoutingModule
    ],
    declarations: [
        MotivoSolicitudFormComponent,
        MotivoSolicitudTableComponent,
        MotivoSolicitudDetailComponent
    ],
    exports: [],
})

export class MotivoSolicitudModule {

}
