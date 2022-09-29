
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
import { ConoMonetarioRoutingModule } from './cono-monetario-routing.module';
import { ConoMonetarioDetailComponent } from './detail/cono-monetario-detail.component';
import { ConoMonetarioFormComponent } from './form/cono-monetario-form.component';
import { ConoMonetarioTableComponent } from './table/cono-monetario-table.component';






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
        ConoMonetarioRoutingModule
    ],
    declarations: [
        ConoMonetarioFormComponent,
        ConoMonetarioTableComponent,
        ConoMonetarioDetailComponent
    ],
    exports: [],
})

export class ConoMonetarioModule {

}
