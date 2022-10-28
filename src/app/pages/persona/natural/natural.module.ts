
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
import { DireccionModule } from '../direccion/direccion.module';
import { InformacionLaboralModule } from '../informacion-laboral/informacion-laboral.module';
import { PepModule } from '../pep/pep.module';
import { ReferenciaBancariaModule } from '../referencia-bancaria/referencia-bancaria.module';
import { ReferenciaPersonalModule } from '../referencia-personal/referencia-personal.module';
import { NaturalFormComponent } from './form/natural-form.component';
import { NaturalRoutingModule } from './natural-routing.module';





@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        FlexLayoutModule,
        NaturalRoutingModule,
        // Core
        MaterialModule,
        SirioSharedModule,
        SharedComponentModule,
        HighlightModule,
        SirioCardModule,

        DireccionModule,
        InformacionLaboralModule,
        PepModule,
        ReferenciaBancariaModule,
        ReferenciaPersonalModule
    ],
    declarations: [
        NaturalFormComponent,
    ],
    exports: [],
})

export class NaturalModule {

}
