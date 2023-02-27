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
import { WFCierreTaquillaDetailComponent } from './wf-cierre-taquilla/detail/wf-cierre-taquilla-detail.component';
import { WFPaseABovedaDetailComponent } from './wf-pase-boveda/detail/wf-pase-boveda-detail.component';
import { WFPaseABovedaFormComponent } from './wf-pase-boveda/form/wf-pase-boveda-form.component';
import { WFPaseEfectivoDetailComponent } from './wf-pase-efectivo/detail/wf-pase-efectivo-detail.component';
import { WFPaseEfectivoFormComponent } from './wf-pase-efectivo/form/wf-pase-efectivo-form.component';
import { WFGestionRemesaReceptorFormComponent } from './wf-solicitud-remesa/wf-gestion-remesa-receptor/form/wf-gestion-remesa-receptor-form.component';
import { WorkflowRoutingModule } from './workflow.routing';
import { TareasTableComponent } from './tareas/table/tareas-table.component';
import { WFChequearPersonaNaturalFormComponent } from './wf-revision-cliente/wf-chequear-cliente/form/wf-chequear-persona-natural-form.component';
import { WFChequearPersonaJuridicoFormComponent } from './wf-revision-cliente/wf-chequear-cliente/form/wf-chequear-persona-juridico-form.component';
import { WFAprobarRechazarPlazoFijoFormComponent } from './wf-plazo-fijo/wf-aprobar-rechazar-plazo-fijo/wf-aprobar-rechazar-plazo-fijo-form.component';


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
    WFPaseABovedaDetailComponent,
    WFPaseABovedaFormComponent,
    WFCierreTaquillaDetailComponent,
    WFGestionRemesaReceptorFormComponent,
    WFChequearPersonaNaturalFormComponent,
    WFChequearPersonaJuridicoFormComponent,
    WFAprobarRechazarPlazoFijoFormComponent,
    TareasTableComponent
  ],
  exports: []
})
export class WorkflowModule {

}






