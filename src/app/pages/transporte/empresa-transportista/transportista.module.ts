
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
import { AvaluoTransporteTableComponent } from './avaluos/table/avaluo-transporte-table.component';
import { TransportistaDetailComponent } from './detail/transportista-detail.component';
import { EmpleadoTransportePopupComponent } from './empleados/popup/empleado-transporte-popup.component';
import { EmpleadoTransporteTableComponent } from './empleados/table/empleado-transporte-table.component';
import { TransportistaFormComponent } from './form/transportista-form.component';
import { MaterialTransporteTableComponent } from './materiales/table/material-transporte-table.component';
import { TransportistaTableComponent } from './table/transportista-table.component';
import { TerminosTransporteFormComponent } from './terminos/form/terminos-transporte-form.component';
import { TransportistaRoutingModule } from './transportista-routing.module';
import { ViajeTransporteTableComponent } from './viajes/table/viaje-transporte-table.component';
import { ActualizarSaldoTransportistaFormComponent } from './saldos/form/actualizar-saldo-transportista-form.component';
import { ConsultarSaldoTransportistaFormComponent } from './consultar-saldos/form/consultar-saldo-transportista-form.component';





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
        TransportistaRoutingModule
    ],
    declarations: [
        TransportistaFormComponent,
        TransportistaDetailComponent,
        TransportistaTableComponent,
        EmpleadoTransporteTableComponent,
        EmpleadoTransportePopupComponent,
        AvaluoTransporteTableComponent,
        MaterialTransporteTableComponent,
        ViajeTransporteTableComponent,
        TerminosTransporteFormComponent,
        ActualizarSaldoTransportistaFormComponent,
        ConsultarSaldoTransportistaFormComponent,
    ],
    exports: [],
    entryComponents:[EmpleadoTransportePopupComponent]
})

export class TransportistaModule {

}
