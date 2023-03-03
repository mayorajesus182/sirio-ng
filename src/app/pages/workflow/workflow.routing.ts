import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareasTableComponent } from './tareas/table/tareas-table.component';
import { WFCierreTaquillaDetailComponent } from './wf-cierre-taquilla/detail/wf-cierre-taquilla-detail.component';
import { WFPaseABovedaDetailComponent } from './wf-pase-boveda/detail/wf-pase-boveda-detail.component';
import { WFPaseABovedaFormComponent } from './wf-pase-boveda/form/wf-pase-boveda-form.component';
import { WFPaseEfectivoDetailComponent } from './wf-pase-efectivo/detail/wf-pase-efectivo-detail.component';
import { WFPaseEfectivoFormComponent } from './wf-pase-efectivo/form/wf-pase-efectivo-form.component';
import { WFChequearPersonaJuridicoFormComponent } from './wf-revision-cliente/wf-chequear-cliente/form/wf-chequear-persona-juridico-form.component';
import { WFChequearPersonaNaturalFormComponent } from './wf-revision-cliente/wf-chequear-cliente/form/wf-chequear-persona-natural-form.component';
import { WFAprobarRechazarPlazoFijoFormComponent } from './wf-plazo-fijo/wf-aprobar-rechazar-plazo-fijo/wf-aprobar-rechazar-plazo-fijo-form.component';
import { WFActivarAnularPlazoFijoFormComponent } from './wf-plazo-fijo/wf-activar-anular-plazo-fijo/wf-activar-anular-plazo-fijo-form.component';


const workflowRoutes: Routes = [
    {
        path: 'pase-efectivo/:wf/:exp/edit',
        component: WFPaseEfectivoFormComponent,
        data: { title: 'Workflow Pase de Efectivo' }
    },
    {
        path: 'pase-efectivo/:wf/:exp/view',
        component: WFPaseEfectivoDetailComponent,
        data: { title: 'Workflow Pase de Efectivo' }
    },
    {
        path: 'pase-boveda/:wf/:exp/edit',
        component: WFPaseABovedaFormComponent,
        data: { title: 'Workflow Pase a Bóveda' }
    },
    {
        path: 'pase-boveda/:wf/:exp/view',
        component: WFPaseABovedaDetailComponent,
        data: { title: 'Workflow Pase a Bóveda' }
    },
    {
        path: 'cierre-taquilla/:wf/:exp/view',
        component: WFCierreTaquillaDetailComponent,
        data: { title: 'Workflow Cierre de Taquilla' }
    },
    {
        path: 'natural/:exp/check',
        component: WFChequearPersonaNaturalFormComponent,
        data: { title: 'Workflow Chequeo de Persona Natural' }
    },
    {
        path: 'juridico/:exp/check',
        component: WFChequearPersonaJuridicoFormComponent,
        data: { title: 'Workflow Chequeo de Persona Juridica' }
    },
    {
        path: 'tareas',
        component: TareasTableComponent,
        data: { title: 'Tareas Globales' }
    },
    {
        path: 'plazo-fijo/:wf/:exp/approve',
        component: WFAprobarRechazarPlazoFijoFormComponent,
        data: { title: 'Workflow Aprobar/Rechazar Plazo Fijo' }
    },
    {
        path: 'plazo-fijo/:wf/:exp/activate',
        component: WFActivarAnularPlazoFijoFormComponent,
        data: { title: 'Workflow Activar/Anular Plazo Fijo' }
    },
    // {
    //     path: 'solicitud-remesa/:wf/:exp/send',
    //     component: WFGestionRemesaReceptorFormComponent,
    //     data: { title: 'Workflow Gestión de Remesas por parte del Receptor' }
    // },

];

@NgModule({
    imports: [RouterModule.forChild(workflowRoutes)],
    exports: [RouterModule]
})
export class WorkflowRoutingModule {
}
