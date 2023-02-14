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
import { NivelPersonaFormComponent } from './form/nivel-persona-form.component';
import { NivelPersonaTableComponent } from './table/nivel-persona-table.component';
import { NivelPersonaDetailComponent } from './detail/nivel-persona-detail.component';
import { NivelPersonaRoutingModule } from './nivel-persona-routing.module';


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
        NivelPersonaRoutingModule
    ],
    declarations: [
        NivelPersonaFormComponent,
        NivelPersonaTableComponent,
        NivelPersonaDetailComponent
    ],
    exports: [],
})

export class NivelPersonaModule {

}
