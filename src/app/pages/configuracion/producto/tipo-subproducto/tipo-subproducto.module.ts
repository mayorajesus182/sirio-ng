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
import { TipoSubproductoDetailComponent } from './detail/tipo-subproducto-detail.component';
import { TipoSubproductoFormComponent } from './form/tipo-subproducto-form.component';
import { TipoSubproductoTableComponent } from './table/tipo-subproducto-table.component';
import { TipoSubproductoRoutingModule } from './tipo-subproducto-routing.module';


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
        TipoSubproductoRoutingModule,
    ],
    declarations: [
        TipoSubproductoFormComponent,
        TipoSubproductoTableComponent,
        TipoSubproductoDetailComponent
    ],
    exports: [],
})

export class TipoSubproductoModule {

}
