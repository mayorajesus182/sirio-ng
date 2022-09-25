
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
import { FormaJuridicaDetailComponent } from './detail/forma-juridica-detail.component';
import { FormaJuridicaFormComponent } from './form/forma-juridica-form.component';
import { FormaJuridicaRoutingModule } from './forma-juridica-routing.module';
import { FormaJuridicaTableComponent } from './table/forma-juridica-table.component';



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
        FormaJuridicaRoutingModule
    ],
    declarations: [
        FormaJuridicaFormComponent,
        FormaJuridicaTableComponent,
        FormaJuridicaDetailComponent
    ],
    exports: [],
})

export class FormaJuridicaModule {

}
