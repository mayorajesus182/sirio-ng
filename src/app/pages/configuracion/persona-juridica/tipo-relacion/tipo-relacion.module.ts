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
import { TipoRelacionDetailComponent } from './detail/tipo-relacion-detail.component';
import { TipoRelacionFormComponent } from './form/tipo-relacion-form.component';
import { TipoRelacionRoutingModule } from './tipo-relacion-routing.module';
import { TipoRelacionTableComponent } from './table/tipo-relacion-table.component';

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
        TipoRelacionRoutingModule
    ],
    declarations: [
        TipoRelacionFormComponent,
        TipoRelacionTableComponent,
        TipoRelacionDetailComponent
    ],
    exports: [],
})

export class TipoRelacionModule {

}
