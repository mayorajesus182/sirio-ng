
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
import { TaquillaDetailComponent } from './detail/taquilla-detail.component';
import { TaquillaFormComponent } from './form/taquilla-form.component';
import { TaquillaTableComponent } from './table/taquilla-table.component';
import { TaquillaRoutingModule } from './taquilla-routing.module';





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
        TaquillaRoutingModule
    ],
    declarations: [
        TaquillaFormComponent,
        TaquillaDetailComponent,
        TaquillaTableComponent
    ],
    exports: [],
})

export class TaquillaModule {

}
