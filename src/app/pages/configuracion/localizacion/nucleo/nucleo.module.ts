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
import { NucleoDetailComponent } from './detail/nucleo-detail.component';
import { NucleoFormComponent } from './form/nucleo-form.component';
import { NucleoRoutes } from './nucleo-routing.module';
import { NucleoComponent } from './nucleo.component';
import { NucleoTableComponent } from './table/nucleo-table.component';

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
        RouterModule.forChild(NucleoRoutes)
    ],
    declarations: [
        NucleoComponent,
        NucleoFormComponent,
        NucleoTableComponent,
        NucleoDetailComponent
    ],
    exports: [],
})

export class NucleoModule {

}
