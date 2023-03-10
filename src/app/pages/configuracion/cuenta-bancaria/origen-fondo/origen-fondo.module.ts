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
import { OrigenFondoDetailComponent } from './detail/origen-fondo-detail.component';
import { OrigenFondoFormComponent } from './form/origen-fondo-form.component';
import { OrigenFondoRoutingModule } from './origen-fondo-routing.module';
import { OrigenFondoTableComponent } from './table/origen-fondo-table.component';


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
        OrigenFondoRoutingModule,
    ],
    declarations: [
        OrigenFondoFormComponent,
        OrigenFondoTableComponent,
        OrigenFondoDetailComponent
    ],
    exports: [],
})

export class OrigenFondoModule {

}
