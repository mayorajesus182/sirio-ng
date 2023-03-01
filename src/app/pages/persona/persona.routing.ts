import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const personaRoutes: Routes = [

    {
        path: 'natural',
        data: { title: 'Persona Natural' },
        loadChildren: () => import('./natural/natural.module').then(m => m.NaturalModule),
    },
    {
        path: 'juridica',
        data: { title: 'Persona Jurídica' },
        loadChildren: () => import('./juridico/juridico.module').then(m => m.JuridicoModule),
    },
 
    {
        path: 'apertura-cuenta',
        data: { title: 'Apertura de Cuenta' },
        loadChildren: () => import('./cuenta-banco/cuenta-banco.module').then(m => m.CuentaBancoModule),
    },
    {
        path: 'plazo-fijo',
        data: { title: 'Plazo Fijo' },
        loadChildren: () => import('./plazo-fijo/plazo-fijo.module').then(m => m.PlazoFijoModule),
    },
    {
        path: 'reporte-ficha-cliente',
        data: { title: 'Reporte Ficha Cliene' },
        loadChildren: () => import('./reports/ficha-cliente/reporte-ficha-cliente.module').then(m => m.ReporteFichaClienteModule),
    },
    {
        path: 'reporte-certificado-cuenta',
        data: { title: 'Reporte Certificado Cuenta' },
        loadChildren: () => import('./reports/certificado-cuenta/reporte-certificado-cuenta.module').then(m => m.ReporteCertificadoCuentaModule),
    },

];

@NgModule({
    imports: [RouterModule.forChild(personaRoutes)],
    exports: [RouterModule]
})
export class PersonaRoutingModule {
}