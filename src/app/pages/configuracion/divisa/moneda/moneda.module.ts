
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
import { MonedaDetailComponent } from './detail/moneda-detail.component';
import { MonedaFormComponent } from './form/moneda-form.component';
import { MonedaRoutingModule } from './moneda-routing.module';
import { MonedaTableComponent } from './table/moneda-table.component';




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
        MonedaRoutingModule
    ],
    declarations: [
        MonedaFormComponent,
        MonedaTableComponent,
        MonedaDetailComponent
    ],
    exports: [],
})

export class MonedaModule {

}
