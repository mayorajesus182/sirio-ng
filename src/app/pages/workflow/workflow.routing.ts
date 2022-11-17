import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WFCierreTaquillaDetailComponent } from './wf-cierre-taquilla/detail/wf-cierre-taquilla-detail.component';
import { WFPaseABovedaDetailComponent } from './wf-pase-boveda/detail/wf-pase-boveda-detail.component';
import { WFPaseABovedaFormComponent } from './wf-pase-boveda/form/wf-pase-boveda-form.component';
import { WFPaseEfectivoDetailComponent } from './wf-pase-efectivo/detail/wf-pase-efectivo-detail.component';
import { WFPaseEfectivoFormComponent } from './wf-pase-efectivo/form/wf-pase-efectivo-form.component';
import { WFGestionRemesaReceptorFormComponent } from './wf-solicitud-remesa/wf-gestion-remesa-receptor/form/wf-gestion-remesa-receptor-form.component';


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
        path: 'solicitud-remesa/:wf/:exp/send',
        component: WFGestionRemesaReceptorFormComponent,
        data: { title: 'Workflow Gestión de Remesas por parte del Receptor' }
    },

];

@NgModule({
    imports: [RouterModule.forChild(workflowRoutes)],
    exports: [RouterModule]
})
export class WorkflowRoutingModule {
}
