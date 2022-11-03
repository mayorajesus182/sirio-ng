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
import { ApoderadoModule } from '../apoderado/apoderado.module';
import { DireccionModule } from '../direccion/direccion.module';
import { EmpresaRelacionadaModule } from '../empresa-relacionada/empresa-relacionada.module';
import { InformacionLaboralModule } from '../informacion-laboral/informacion-laboral.module';
import { PepModule } from '../pep/pep.module';
import { ReferenciaBancariaModule } from '../referencia-bancaria/referencia-bancaria.module';
import { ReferenciaPersonalModule } from '../referencia-personal/referencia-personal.module';
import { TelefonoModule } from '../telefono/telefono.module';
import { JuridicoFormComponent } from './form/juridico-form.component';
import { JuridicoRoutingModule } from './juridico-routing.module';


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
        JuridicoRoutingModule,
        DireccionModule,
        InformacionLaboralModule,
        ApoderadoModule,
        TelefonoModule,
        PepModule,
        EmpresaRelacionadaModule,
        ReferenciaBancariaModule,
        ReferenciaPersonalModule
    ],
    declarations: [
        JuridicoFormComponent,
    ],
    exports: [],
})

export class JuridicoModule {

}