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
import { TipoProductoDetailComponent } from './detail/tipo-producto-detail.component';
import { TipoProductoFormComponent } from './form/tipo-producto-form.component';
import { TipoProductoRoutingModule } from './tipo-producto-routing.module';
import { TipoProductoTableComponent } from './table/tipo-producto-table.component';

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
        TipoProductoRoutingModule
    ],
    declarations: [
        TipoProductoFormComponent,
        TipoProductoTableComponent,
        TipoProductoDetailComponent
    ],
    exports: [],
})

export class TipoProductoModule {

}
