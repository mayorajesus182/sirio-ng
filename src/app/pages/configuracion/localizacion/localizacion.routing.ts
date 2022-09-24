import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const configuracionRoutes: Routes = [

    {
        path: 'pais',
        data: { title: 'País' },
        loadChildren: () => import('./pais/pais.module').then(m => m.PaisModule),
    },
    {
        path: 'estado',
        data: { title: 'Estado' },
        loadChildren: () => import('./estado/estado.module').then(m => m.EstadoModule),
    },
    {
        path: 'nucleo',
        data: { title: 'Nucleo' },
        loadChildren: () => import('./nucleo/nucleo.module').then(m => m.NucleoModule),
    }

];


@NgModule({
    imports: [RouterModule.forChild(configuracionRoutes)],
    exports: [RouterModule]
})
export class LocalizacionRoutingModule {
}
