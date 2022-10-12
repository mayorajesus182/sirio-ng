import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbsModule } from 'src/@sirio/shared/breadcrumbs/breadcrumbs.module';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { HighlightModule } from 'src/@sirio/shared/highlightjs/highlight.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { WFPaseEfectivoDetailComponent } from './wf-pase-efectivo/detail/wf-pase-efectivo-detail.component';
import { WFPaseEfectivoFormComponent } from './wf-pase-efectivo/form/wf-pase-efectivo-form.component';
import { WorkflowRoutingModule } from './workflow.routing';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule,
    SirioSharedModule,
    SharedComponentModule,
    HighlightModule,
    SirioCardModule,
    BreadcrumbsModule,

    WorkflowRoutingModule
  ],
  declarations: [
    WFPaseEfectivoDetailComponent,
    WFPaseEfectivoFormComponent,
  ],
  exports: []
})
export class WorkflowModule {

}






