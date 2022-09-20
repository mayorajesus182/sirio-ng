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
import { PaisDetailComponent } from './detail/pais-detail.component';
import { PaisFormComponent } from './form/pais-form.component';
import { PaisRoutes } from './pais-routing.module';
import { PaisComponent } from './pais.component';
import { PaisTableComponent } from './table/pais-table.component';

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
        RouterModule.forChild(PaisRoutes)
    ],
    declarations: [
        PaisComponent,
        PaisFormComponent,
        PaisTableComponent,
        PaisDetailComponent
    ],
    exports: [],
})

export class PaisModule {

}
