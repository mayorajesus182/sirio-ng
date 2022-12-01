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
import { TipoParticipacionDetailComponent } from './detail/tipo-participacion-detail.component';
import { TipoParticipacionFormComponent } from './form/tipo-participacion-form.component';
import { TipoParticipacionTableComponent } from './table/tipo-participacion-table.component';
import { TipoParticipacionRoutingModule } from './tipo-participation-routing.module';



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
        TipoParticipacionRoutingModule,
    ],
    declarations: [
        TipoParticipacionFormComponent,
        TipoParticipacionTableComponent,
        TipoParticipacionDetailComponent
    ],
    exports: [],
})

export class TipoParticipacionModule {

}
