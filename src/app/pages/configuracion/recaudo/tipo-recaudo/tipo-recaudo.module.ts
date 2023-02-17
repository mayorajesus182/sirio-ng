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
import { TipoRecaudoRoutingModule } from './tipo-recaudo-routing.module';
import { TipoRecaudoFormComponent } from './form/tipo-recaudo-form.component';
import { TipoRecaudoTableComponent } from './table/tipo-recaudo-table.component';
import { TipoRecaudoDetailComponent } from './detail/tipo-recaudo-detail.component';

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
        TipoRecaudoRoutingModule
    ],
    declarations: [
        TipoRecaudoFormComponent,
        TipoRecaudoTableComponent,
        TipoRecaudoDetailComponent
    ],
    exports: [],
})

export class TipoRecaudoModule {

}
