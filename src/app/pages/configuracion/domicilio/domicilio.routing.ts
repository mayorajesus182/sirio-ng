import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const domicilioRoutes: Routes = [

    {
        path: 'tenencia',
        data: { title: 'Tenencia' },
        loadChildren: () => import('./tenencia/tenencia.module').then(m => m.TenenciaModule),
    },
   
    {
        path: 'construccion',
        data: { title: 'Construcción' },
        loadChildren: () => import('./construccion/construccion.module').then(m => m.ConstruccionModule),
    },
    

];


@NgModule({
    imports: [RouterModule.forChild(domicilioRoutes)],
    exports: [RouterModule]
})
export class DomicilioRoutingModule {
}
