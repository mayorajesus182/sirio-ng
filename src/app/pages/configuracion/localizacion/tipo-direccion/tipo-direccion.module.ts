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
import { TipoDireccionDetailComponent } from './detail/tipo-direccion-detail.component';
import { TipoDireccionFormComponent } from './form/tipo-direccion-form.component';
import { TipoDireccionRoutingModule } from './tipo-direccion-routing.module';
import { TipoDireccionTableComponent } from './table/tipo-direccion-table.component';

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
        TipoDireccionRoutingModule
    ],
    declarations: [
        TipoDireccionFormComponent,
        TipoDireccionTableComponent,
        TipoDireccionDetailComponent
    ],
    exports: [],
})

export class TipoDireccionModule {

}
