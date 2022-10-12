import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WFPaseEfectivoDetailComponent } from './wf-pase-efectivo/detail/wf-pase-efectivo-detail.component';
import { WFPaseEfectivoFormComponent } from './wf-pase-efectivo/form/wf-pase-efectivo-form.component';


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
    }

];

@NgModule({
    imports: [RouterModule.forChild(workflowRoutes)],
    exports: [RouterModule]
})
export class WorkflowRoutingModule {
}
