import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const personaNaturalRoutes: Routes = [

    {
        path: 'cargo',
        data: { title: 'Cargo' },
        loadChildren: () => import('./cargo/cargo.module').then(m => m.CargoModule),
    },
    {
        path: 'genero',
        data: { title: 'Genéro' },
        loadChildren: () => import('./genero/genero.module').then(m => m.GeneroModule),
    },
    {
        path: 'estado-civil',
        data: { title: 'Estado Civil' },
        loadChildren: () => import('./estado-civil/estado-civil.module').then(m => m.EstadoCivilModule),
    },
    {
        path: 'nivel-estudio',
        data: { title: 'Nivel de Estudio' },
        loadChildren: () => import('./nivel-estudio/nivel-estudio.module').then(m => m.NivelEstudioModule),
    },
    {
        path: 'actividad-independiente',
        data: { title: 'Actividad Independiente' },
        loadChildren: () => import('./actividad-independiente/actividad-independiente.module').then(m => m.ActividadIndependienteModule),
    },
    {
        path: 'profesion',
        data: { title: 'Profesión' },
        loadChildren: () => import('./profesion/profesion.module').then(m => m.ProfesionModule),
    },
    {
        path: 'tipo-ingreso',
        data: { title: 'Tipo de Ingreso' },
        loadChildren: () => import('./tipo-ingreso/tipo-ingreso.module').then(m => m.TipoIngresoModule),
    },
    {
        path: 'tipo-referencia',
        data: { title: 'Tipo de Referencia' },
        loadChildren: () => import('./tipo-referencia/tipo-referencia.module').then(m => m.TipoReferenciaModule),
    },
    {
        path: 'tipo-pep',
        data: { title: 'Tipo Pep' },
        loadChildren: () => import('./tipo-pep/tipo-pep.module').then(m => m.TipoPepModule),
    },
   
   

];


@NgModule({
    imports: [RouterModule.forChild(personaNaturalRoutes)],
    exports: [RouterModule]
})
export class PersonaNaturalRoutingModule {
}
