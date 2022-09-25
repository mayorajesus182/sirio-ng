
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
import { ZonaPostalDetailComponent } from './detail/zona-postal-detail.component';
import { ZonaPostalFormComponent } from './form/zona-postal-form.component';
import { ZonaPostalTableComponent } from './table/zona-postal-table.component';

import { ZonaPostalRoutingModule } from './zona-postal-routing.module';

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
        ZonaPostalRoutingModule
    ],
    declarations: [
        ZonaPostalFormComponent,
        ZonaPostalTableComponent,
        ZonaPostalDetailComponent
    ],
    exports: [],
})

export class ZonaPostalModule {

}
