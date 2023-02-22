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
import { PlazoDPFRoutingModule } from './plazo-dpf-routing.module';
import { PlazoDPFFormComponent } from './form/plazo-dpf-form.component';
import { PlazoDPFTableComponent } from './table/plazo-dpf-table.component';
import { PlazoDPFDetailComponent } from './detail/plazo-dpf-detail.component';

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
        PlazoDPFRoutingModule
    ],
    declarations: [
        PlazoDPFFormComponent,
        PlazoDPFTableComponent,
        PlazoDPFDetailComponent
    ],
    exports: [],
})

export class PlazoDPFModule {

}
