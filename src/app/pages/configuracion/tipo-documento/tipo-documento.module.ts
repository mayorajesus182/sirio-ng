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
import { TipoDocumentoDetailComponent } from './detail/tipo-documento-detail.component';
import { TipoDocumentoFormComponent } from './form/tipo-documento-form.component';
import { TipoDocumentoRoutingModule } from './tipo-documento-routing.module';
import { TipoDocumentoTableComponent } from './table/tipo-documento-table.component';

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
        TipoDocumentoRoutingModule
    ],
    declarations: [
        TipoDocumentoFormComponent,
        TipoDocumentoTableComponent,
        TipoDocumentoDetailComponent
    ],
    exports: [],
})

export class TipoDocumentoModule {

}
