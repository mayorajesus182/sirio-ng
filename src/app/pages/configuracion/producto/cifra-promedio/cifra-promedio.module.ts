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
import { CifraPromedioRoutingModule } from './cifra-promedio-routing.module';
import { CifraPromedioDetailComponent } from './detail/cifra-promedio-detail.component';
import { CifraPromedioFormComponent } from './form/cifra-promedio-form.component';
import { CifraPromedioTableComponent } from './table/cifra-promedio-table.component';


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
        CifraPromedioRoutingModule,
    ],
    declarations: [
        CifraPromedioFormComponent,
        CifraPromedioTableComponent,
        CifraPromedioDetailComponent
    ],
    exports: [],
})

export class CifraPromedioModule {

}
