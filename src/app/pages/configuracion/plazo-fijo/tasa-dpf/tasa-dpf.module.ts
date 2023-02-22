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
import { TasaDPFRoutingModule } from './tasa-dpf-routing.module';
import { TasaDPFFormComponent } from './form/tasa-dpf-form.component';
import { TasaDPFTableComponent } from './table/tasa-dpf-table.component';
import { TasaDPFDetailComponent } from './detail/tasa-dpf-detail.component';


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
        TasaDPFRoutingModule
    ],
    declarations: [
        TasaDPFFormComponent,
        TasaDPFTableComponent,
        TasaDPFDetailComponent
    ],
    exports: [],
})

export class TasaDPFModule {

}
