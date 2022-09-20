
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
import { EstadoDetailComponent } from './detail/estado-detail.component';
import { EstadoRoutes } from './estado-routing.module';
import { EstadoComponent } from './estado.component';
import { EstadoFormComponent } from './form/estado-form.component';
import { EstadoTableComponent } from './table/estado-table.component';

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
        RouterModule.forChild(EstadoRoutes)
    ],
    declarations: [
        EstadoComponent,
        EstadoFormComponent,
        EstadoTableComponent,
        EstadoDetailComponent
    ],
    exports: [],
})

export class EstadoModule {

}
