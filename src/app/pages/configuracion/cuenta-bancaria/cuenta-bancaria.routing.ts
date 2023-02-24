import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const cuentaBancariaRoutes: Routes = [

    {
        path: 'motivo-solicitud',
        data: { title: 'Motivo de Solicitud' },
        loadChildren: () => import('./motivo-solicitud/motivo-solicitud.module').then(m => m.MotivoSolicitudModule),
    },
    {
        path: 'promedio-transaccion',
        data: { title: 'Promedio de Transacción' },
        loadChildren: () => import('./promedio-transaccion/promedio-transaccion.module').then(m => m.PromedioTransaccionModule),
    },
    {
        path: 'cifra-promedio',
        data: { title: 'Cifra Promedio' },
        loadChildren: () => import('./cifra-promedio/cifra-promedio.module').then(m => m.CifraPromedioModule),
    },
    {
        path: 'promedio-monto',
        data: { title: 'Promedio de Monto' },
        loadChildren: () => import('./promedio-monto/promedio-monto.module').then(m => m.PromedioMontoModule),
    },
    {
        path: 'tipo-participacion',
        data: { title: 'Tipo de Participacion' },
        loadChildren: () => import('./tipo-participacion/tipo-participation.module').then(m => m.TipoParticipacionModule),
    },
    {
        path: 'destino-cuenta',
        data: { title: 'Destino de Cuenta' },
        loadChildren: () => import('./destino-cuenta/destino-cuenta.module').then(m => m.DestinoCuentaModule),
    },
    {
        path: 'origen-fondo',
        data: { title: 'Origen de Fondo' },
        loadChildren: () => import('./origen-fondo/origen-fondo.module').then(m => m.OrigenFondoModule),
    },
    {
        path: 'tipo-firma',
        data: { title: 'Tipo de Firma' },
        loadChildren: () => import('./tipo-firma/tipo-firma.module').then(m => m.TipoFirmaModule),
    },
    {
        path: 'tipo-firmante',
        data: { title: 'Tipo de Firma' },
        loadChildren: () => import('./tipo-firmante/tipo-firmante.module').then(m => m.TipoFirmanteModule),
    },
];


@NgModule({
    imports: [RouterModule.forChild(cuentaBancariaRoutes)],
    exports: [RouterModule]
})
export class CuentaBancariaRoutingModule {
}
