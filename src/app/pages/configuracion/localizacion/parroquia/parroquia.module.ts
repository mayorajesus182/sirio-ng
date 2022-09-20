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
import { ParroquiaDetailComponent } from './detail/parroquia-detail.component';
import { ParroquiaFormComponent } from './form/parroquia-form.component';
import { ParroquiaRoutes } from './parroquia-routing.module';
import { ParroquiaComponent } from './parroquia.component';
import { ParroquiaTableComponent } from './table/parroquia-table.component';

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
        RouterModule.forChild(ParroquiaRoutes)
    ],
    declarations: [
        ParroquiaComponent,
        ParroquiaFormComponent,
        ParroquiaTableComponent,
        ParroquiaDetailComponent
    ],
    exports: [],
})

export class ParroquiaModule {

}
