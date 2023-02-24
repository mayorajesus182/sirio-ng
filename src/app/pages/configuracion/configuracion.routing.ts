import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const configuracionRoutes: Routes = [
    {
        path: 'contabilidad',
        data: { title: 'Contabilidad' },
        loadChildren: () => import('./contabilidad/contabilidad.module').then(m => m.ContabilidadModule),
    },
    {
        path: 'localizacion',
        data: { title: 'Localización' },
        loadChildren: () => import('./localizacion/localizacion.module').then(m => m.LocalizacionModule),
    },
    {
        path: 'persona-juridica',
        data: { title: 'Persona Jurídica' },
        loadChildren: () => import('./persona-juridica/persona-judirica.module').then(m => m.PersonaJuridicaModule),
    },
    {
        path: 'persona-natural',
        data: { title: 'Persona Natural' },
        loadChildren: () => import('./persona-natural/persona-natural.module').then(m => m.PersonaNaturalModule),
    },
    {
        path: 'entidad-financiera',
        data: { title: 'Entidad Financiera' },
        loadChildren: () => import('./entidad-financiera/entidad-financiera.module').then(m => m.EntidadFinancieraModule),
    },
    {
        path: 'tipo-documento',
        data: { title: 'Tipo de Documento' },
        loadChildren: () => import('./tipo-documento/tipo-documento.module').then(m => m.TipoDocumentoModule),
    },
    {
        path: 'tipo-persona',
        data: { title: 'Tipo de Persona' },
        loadChildren: () => import('./tipo-persona/tipo-persona.module').then(m => m.TipoPersonaModule),
    },
    {
        path: 'producto',
        data: { title: 'Producto' },
        loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule),
    },
    {
        path: 'taquilla',
        data: { title: 'Taquilla' },
        loadChildren: () => import('./taquilla/taquilla.module').then(m => m.TaquillaModule),
    },
    {
        path: 'divisa',
        data: { title: 'Divisa' },
        loadChildren: () => import('./divisa/divisa.module').then(m => m.DivisaModule), 
    },
    {
        path: 'domicilio',
        data: { title: 'Domicilio' },
        loadChildren: () => import('./domicilio/domicilio.module').then(m => m.DomicilioModule), 
    },
    {
        path: 'telefono',
        data: { title: 'Teléfono' },
        loadChildren: () => import('./telefono/telefono.module').then(m => m.TelefonoModule), 
    },
    {
        path: 'gestion-efectivo',
        data: { title: 'Gestion de Efectivo' },
        loadChildren: () => import('./gestion-efectivo/gestion-efectivo.module').then(m => m.GestionEfectivoModule),
    },
    {
        path: 'recaudo',
        data: { title: 'Recaudo' },
        loadChildren: () => import('./recaudo/recaudo.module').then(m => m.RecaudoModule),
    },
    {
        path: 'cuenta-bancaria',
        data: { title: 'Cuenta Bancaria' },
        loadChildren: () => import('./cuenta-bancaria/cuenta-bancaria.module').then(m => m.CuentaBancariaModule),
    },
    {
        path: 'plazo-fijo',
        data: { title: 'Plazo Fijo' },
        loadChildren: () => import('./plazo-fijo/plazo-fijo.module').then(m => m.PlazoFijoModule),
    },
];


@NgModule({
    imports: [RouterModule.forChild(configuracionRoutes)],
    exports: [RouterModule]
})
export class ConfiguracionRoutingModule {
}