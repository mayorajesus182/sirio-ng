import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const personaJuridicaRoutes: Routes = [

    {
        path: 'ramo',
        data: { title: 'Ramo' },
        loadChildren: () => import('./ramo/ramo.module').then(m => m.RamoModule),
    },
    {
        path: 'sector',
        data: { title: 'Sector' },
        loadChildren: () => import('./sector/sector.module').then(m => m.SectorModule),
    },
    {
        path: 'forma-juridica',
        data: { title: 'Forma Juridica' },
        loadChildren: () => import('./forma-juridica/forma-juridica.module').then(m => m.FormaJuridicaModule),
    },
    {
        path: 'categoria-especial',
        data: { title: 'Categoría Especial' },
        loadChildren: () => import('./categoria-especial/categoria-especial.module').then(m => m.CategoriaEspecialModule),
    },
    {
        path: 'actividad-especifica',
        data: { title: 'Actividad Especifica' },
        loadChildren: () => import('./actividad-especifica/actividad-especifica.module').then(m => m.ActividadEspecificaModule),
    },
    {
        path: 'actividad-economica',
        data: { title: 'Actividad Económica' },
        loadChildren: () => import('./actividad-economica/actividad-economica.module').then(m => m.ActividadEconomicaModule),
    },
   
   

];


@NgModule({
    imports: [RouterModule.forChild(personaJuridicaRoutes)],
    exports: [RouterModule]
})
export class PersonaJuridicaRoutingModule {
}
