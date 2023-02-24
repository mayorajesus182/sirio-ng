import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { ClickOutsideModule } from 'src/@sirio/shared/click-outside/click-outside.module';
import { HighlightModule } from 'src/@sirio/shared/highlightjs/highlight.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { ScrollbarModule } from 'src/@sirio/shared/scrollbar/scrollbar.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { AtmRoutingModule } from './atm-routing.module';
import { CajetinTableComponent } from './cajetin/table/cajetin-table.component';
import { AtmDetailComponent } from './detail/atm-detail.component';
import { AtmFormComponent } from './form/atm-form.component';
import { AtmTableComponent } from './table/atm-table.component';


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
        ScrollbarModule,
        ClickOutsideModule,
        AtmRoutingModule,
    ],
    declarations: [
        AtmFormComponent,
        AtmTableComponent,
        AtmDetailComponent,
        CajetinTableComponent,
    ],
    exports: [],
})

export class AtmModule {

}
