
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
import { PaseABovedaDetailComponent } from './detail/pase-boveda-detail.component';
import { PaseABovedaFormComponent } from './form/pase-boveda-form.component';
import { PaseABovedaRoutingModule } from './pase-boveda-routing.module';
import { PaseABovedaTableComponent } from './table/pase-boveda-table.component';


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
        PaseABovedaRoutingModule,
    ],
    declarations: [
        PaseABovedaTableComponent,
        PaseABovedaFormComponent,
        PaseABovedaDetailComponent
    ],
    exports: [],
})

export class PaseABovedaModule {

}