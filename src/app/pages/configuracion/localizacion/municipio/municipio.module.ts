import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'app/shared/directives/shared-directives.module';
import { DomainServicesModule } from 'app/shared/domain/domain.services.module';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MunicipioDetailComponent } from './detail/municipio-detail.component';
import { MunicipioFormComponent } from './form/municipio-form.component';
import { MunicipioRoutes } from './municipio-routing.module';
import {MunicipioComponent } from './municipio.component';
import { MunicipioTableComponent } from './table/municipio-table.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        FlexLayoutModule,
        SharedDirectivesModule,
        SharedComponentsModule,
        SharedPipesModule,
        SharedMaterialModule,
        DomainServicesModule,
        PerfectScrollbarModule,
        RouterModule.forChild(MunicipioRoutes)
    ],
    declarations: [
        MunicipioComponent,
        MunicipioFormComponent,
        MunicipioTableComponent,
        MunicipioDetailComponent
    ],
    exports: [],
})

export class MunicipioModule {

}
