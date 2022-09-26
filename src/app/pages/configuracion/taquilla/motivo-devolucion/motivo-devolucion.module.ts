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
import { MotivoDevolucionDetailComponent } from './detail/motivo-devolucion-detail.component';
import { MotivoDevolucionFormComponent } from './form/motivo-devolucion-form.component';
import { MotivoDevolucionRoutingModule } from './motivo-devolucion-routing.module';
import { MotivoDevolucionTableComponent } from './table/motivo-devolucion-table.component';

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
        MotivoDevolucionRoutingModule
    ],
    declarations: [
        MotivoDevolucionFormComponent,
        MotivoDevolucionTableComponent,
        MotivoDevolucionDetailComponent
    ],
    exports: [],
})

export class MotivoDevolucionModule {

}
