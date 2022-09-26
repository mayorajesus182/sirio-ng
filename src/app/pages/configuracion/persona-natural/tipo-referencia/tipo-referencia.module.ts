
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
import { TipoReferenciaRoutingModule } from './tipo-referencia-routing.module';
import { TipoReferenciaDetailComponent } from './detail/tipo-referencia-detail.component';
import { TipoReferenciaFormComponent } from './form/tipo-referencia-form.component';
import { TipoReferenciaTableComponent } from './table/tipo-referencia-table.component';



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
        TipoReferenciaRoutingModule
    ],
    declarations: [
        TipoReferenciaFormComponent,
        TipoReferenciaTableComponent,
        TipoReferenciaDetailComponent
    ],
    exports: [],
})

export class TipoReferenciaModule {

}
