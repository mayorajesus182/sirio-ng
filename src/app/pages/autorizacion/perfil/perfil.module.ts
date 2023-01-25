import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { PerfilFormComponent } from './form/perfil-form.component';
import { TreeDataService } from './form/tree-data.service';
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
    BreadcrumbsModule,


    ],
    declarations: [PerfilFormComponent, PerfilTableComponent,PerfilViewComponent ],
    providers: [TreeDataService],
    entryComponents: [PerfilPlantillaPopupComponent],
    exports: [],
})
export class PerfilModule { 

}
