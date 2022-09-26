import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const TaquillaRoutes: Routes = [

    {
        path: 'motivo-devolucion',
        data: { title: 'Motivo de Devolución' },
        loadChildren: () => import('./motivo-devolucion/motivo-devolucion.module').then(m => m.MotivoDevolucionModule),
    },
    
   

];


@NgModule({
    imports: [RouterModule.forChild(TaquillaRoutes)],
    exports: [RouterModule]
})
export class TaquillaRoutingModule {
}
