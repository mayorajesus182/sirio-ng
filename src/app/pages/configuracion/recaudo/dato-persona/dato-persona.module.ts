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
import { DatoPersonaRoutingModule } from './dato-persona-routing.module';
import { DatoPersonaFormComponent } from './form/dato-persona-form.component';
import { DatoPersonaTableComponent } from './table/dato-persona-table.component';
import { DatoPersonaDetailComponent } from './detail/dato-persona-detail.component';



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
        DatoPersonaRoutingModule
    ],
    declarations: [
        DatoPersonaFormComponent,
        DatoPersonaTableComponent,
        DatoPersonaDetailComponent
    ],
    exports: [],
})

export class DatoPersonaModule {

}
