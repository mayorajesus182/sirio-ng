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
import { UsuarioDetailComponent } from 'src/app/pages/autorizacion/usuario/detail/usuario-detail.component';
import { UsuarioTableComponent } from 'src/app/pages/autorizacion/usuario/table/usuario-table.component';
import { UserRoutingModule } from 'src/app/pages/autorizacion/usuario/usuario-routing.module';
import { UsuarioFormComponent } from './form/usuario-form.component';

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
        UserRoutingModule,
    ],
    declarations: [
        UsuarioFormComponent,
        UsuarioTableComponent,
        UsuarioDetailComponent,
    ],
    exports: [],
})
export class UsuarioModule {

}
