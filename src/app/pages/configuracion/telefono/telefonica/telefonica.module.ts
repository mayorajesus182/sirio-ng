
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
import { TelefonicaDetailComponent } from './detail/telefonica-detail.component';
import { TelefonicaFormComponent } from './form/telefonica-form.component';
import { TelefonicaTableComponent } from './table/telefonica-table.component';
import { TelefonicaRoutingModule } from './telefonica-routing.module';


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
        TelefonicaRoutingModule
    ],
    declarations: [
        TelefonicaFormComponent,
        TelefonicaTableComponent,
        TelefonicaDetailComponent
    ],
    exports: [],
})

export class TelefonicaModule {

}
