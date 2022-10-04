
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
import { ViajeDetailComponent } from './detail/viaje-detail.component';
import { ViajeFormComponent } from './form/viaje-form.component';
import { ViajeTableComponent } from './table/viaje-table.component';
import { ViajeRoutingModule } from './viaje-routing.module';





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
        ViajeRoutingModule
    ],
    declarations: [
        ViajeFormComponent,
        ViajeDetailComponent,
        ViajeTableComponent
    ],
    exports: [],
})

export class ViajeModule {

}
