import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TreeDataService } from 'src/@sirio/domain/services/autorizacion/tree-data.service';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { PerfilFormComponent } from './form/perfil-form.component';
import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilTableComponent } from './table/perfil-table.component';
import { PerfilViewComponent } from './view/perfil-view.component';
;


// import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';

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

        SirioCardModule,
        BreadcrumbsModule,
        PerfilRoutingModule
    ],
    declarations: [PerfilFormComponent, PerfilTableComponent, PerfilViewComponent],
    providers: [TreeDataService],
    exports: [],
})
export class PerfilModule {

}
