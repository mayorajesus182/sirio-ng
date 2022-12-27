
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { HighlightModule } from 'src/@sirio/shared/highlightjs/highlight.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { EnviarRemesaRoutingModule } from './enviar-remesa-routing.module';
import { DespacharRemesaEnvioFormComponent } from './form/despachar-remesa-envio-form.component';
import { EnviarRemesaFormComponent } from './form/enviar-remesa-form.component';
import { EnviarRemesaTableComponent } from './table/enviar-remesa-table.component';


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
        EnviarRemesaRoutingModule,

        MatNativeDateModule,

    ],
    declarations: [
        EnviarRemesaFormComponent,
        EnviarRemesaTableComponent,
        DespacharRemesaEnvioFormComponent
    ],
    exports: [],
})

export class EnviarRemesaModule {

}