import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const localizacionRoutes: Routes = [

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
        path: 'municipio',
        data: { title: 'Municipio' },
        loadChildren: () => import('./municipio/municipio.module').then(m => m.MunicipioModule),
    },
    {
        path: 'parroquia',
        data: { title: 'Parroquia' },
        loadChildren: () => import('./parroquia/parroquia.module').then(m => m.ParroquiaModule),
    },
    {
        path: 'nucleo',
        data: { title: 'Nucleo' },
        loadChildren: () => import('./nucleo/nucleo.module').then(m => m.NucleoModule),
    },
    {
        path: 'tipo-direccion',
        data: { title: 'Tipo de Dirección' },
        loadChildren: () => import('./tipo-direccion/tipo-direccion.module').then(m => m.TipoDireccionModule),
    },
    {
        path: 'zona-postal',
        data: { title: 'Zona Postal' },
        loadChildren: () => import('./zona-postal/zona-postal.module').then(m => m.ZonaPostalModule),
    },
    {
        path: 'via',
        data: { title: 'Vía' },
        loadChildren: () => import('./via/via.module').then(m => m.ViaModule),
    }

];


@NgModule({
    imports: [RouterModule.forChild(localizacionRoutes)],
    exports: [RouterModule]
})
export class LocalizacionRoutingModule {
}
