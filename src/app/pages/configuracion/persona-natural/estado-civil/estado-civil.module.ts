
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
import { EstadoCivilDetailComponent } from './detail/estado-civil-detail.component';
import { EstadoCivilFormComponent } from './form/estado-civil-form.component';
import { EstadoCivilRoutingModule } from './estado-civil-routing.module';
import { EstadoCivilTableComponent } from './table/estado-civil-table.component';



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
        EstadoCivilRoutingModule
    ],
    declarations: [
        EstadoCivilFormComponent,
        EstadoCivilTableComponent,
        EstadoCivilDetailComponent
    ],
    exports: [],
})

export class EstadoCivilModule {

}
