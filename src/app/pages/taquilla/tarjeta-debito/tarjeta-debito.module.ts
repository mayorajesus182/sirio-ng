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
import { EntregaFormComponent } from './entrega/entrega-form.component';
import { TarjetaDebitoFormComponent } from './form/tarjeta-debito-form.component';
import { InformacionTarjetaTableComponent } from './informacion-tarjeta-debito/informacion-tarjeta-table.component';
import { InformacionTarjetaFormPopupComponent } from './popup/informacion-tarjeta-form.popup.component';
import { TarjetaDebitoRoutingModule } from './tarjeta-debito-routing.module';

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
        TarjetaDebitoRoutingModule
    ],
    declarations: [
        TarjetaDebitoFormComponent,
        EntregaFormComponent,
        InformacionTarjetaTableComponent,
        InformacionTarjetaFormPopupComponent

    ],
    exports: [],
})

export class TarjetaDebitoModule {

}
