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
import { IdiomaDetailComponent } from './detail/idioma-detail.component';
import { IdiomaFormComponent } from './form/idioma-form.component';
import { IdiomaRoutingModule } from './idioma-routing.module';
import { IdiomaTableComponent } from './table/idioma-table.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SirioSharedModule,
        // FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        FlexLayoutModule,
        // Core
        SharedComponentModule,
        HighlightModule,
        SirioCardModule,

        IdiomaRoutingModule,
    ],
    declarations: [
        IdiomaFormComponent,
        IdiomaTableComponent,
        IdiomaDetailComponent
    ],
    exports: [],
})

export class IdiomaModule {

}
