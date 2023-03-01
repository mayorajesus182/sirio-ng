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
import { PlazoRoutingModule } from './plazo-routing.module';
import { PlazoFormComponent } from './form/plazo-form.component';
import { PlazoTableComponent } from './table/plazo-table.component';
import { PlazoDetailComponent } from './detail/plazo-detail.component';

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
        PlazoRoutingModule
    ],
    declarations: [
        PlazoFormComponent,
        PlazoTableComponent,
        PlazoDetailComponent
    ],
    exports: [],
})

export class PlazoModule {

}
