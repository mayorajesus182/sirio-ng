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
import { TipoFirmaDetailComponent } from './detail/tipo-firma-detail.component';
import { TipoFirmaFormComponent } from './form/tipo-firma-form.component';
import { TipoFirmaTableComponent } from './table/tipo-firma-table.component';
import { TipoFirmaRoutingModule } from './tipo-firma-routing.module';


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
        TipoFirmaRoutingModule,
    ],
    declarations: [
        TipoFirmaFormComponent,
        TipoFirmaTableComponent,
        TipoFirmaDetailComponent
    ],
    exports: [],
})

export class TipoFirmaModule {

}
