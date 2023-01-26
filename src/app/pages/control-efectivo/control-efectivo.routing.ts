import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const controlEfectivoRoutes: Routes = [
    {
        path: 'pase-efectivo',
        data: { title: 'Pases de Efectivo' },
        loadChildren: () => import('./pase-efectivo/pase-efectivo.module').then(m => m.PaseEfectivoModule),
    },
    {
        path: 'arqueo-atm',
        data: { title: 'Arqueos de ATM' },
        loadChildren: () => import('./arqueo-atm/arqueo-atm.module').then(m => m.ArqueoAtmModule),
    },
    {
        path: 'cierre-agencia',
        data: { title: 'Cierre de Agencia' },
        loadChildren: () => import('./cierre-agencia/cierre-agencia.module').then(m => m.CierreAgenciaModule),
    },
    {
        path: 'pase-boveda',
        data: { title: 'Pases a Bóveda' },
        loadChildren: () => import('./pase-boveda/pase-boveda.module').then(m => m.PaseABovedaModule),
    },
    {
        path: 'cierre-taquilla',
        data: { title: 'Pases a Bóveda' },
        loadChildren: () => import('./cierre-taquilla/cierre-taquilla.module').then(m => m.CierreTaquillaModule),
    },
    // {
    //     path: 'solicitud-remesa',
    //     data: { title: 'Remesa' },
    //     loadChildren: () => import('./remesa/remesa.module').then(m => m.RemesaModule),
    // },


    {
        path: 'remesa',
        data: { title: 'Remesas' },
        loadChildren: () => import('./remesa/remesa.module').then(m => m.RemesaModule),
    },


    


    // {
    //     path: 'ingreso-boveda',
    //     data: { title: 'Ingresar Remesa' },
    //     loadChildren: () => import('./remesa/ingresar-compra/ingresar-compra.module').then(m => m.IngresarCompraBcvModule),
    // },
    // {
    //     path: 'solicitar-remesa',
    //     data: { title: 'Solicitar Remesa' },
    //     loadChildren: () => import('./remesa/solicitar-remesa/solicitar-remesa.module').then(m => m.SolicitarRemesaModule),
    // },
    // {
    //     path: 'enviar-remesa',
    //     data: { title: 'Enviar Remesa' },
    //     loadChildren: () => import('./remesa/enviar-remesa/enviar-remesa.module').then(m => m.EnviarRemesaModule),
    // },
    // {
    //     path: 'procesar-remesa',
    //     data: { title: 'Procesar Remesa' },
    //     loadChildren: () => import('./remesa/procesar-remesa/procesar-remesa.module').then(m => m.ProcesarRemesaModule),
    // },
    // // {
    // //     path: 'despachar-remesa',
    // //     data: { title: 'Despachar Remesa' },
    // //     loadChildren: () => import('./remesa/despachar-remesa/despachar-remesa.module').then(m => m.DespacharRemesaModule),
    // // },
    // {
    //     path: 'recibir-remesa',
    //     data: { title: 'Despachar Remesa' },
    //     loadChildren: () => import('./remesa/recibir-remesa/recibir-remesa.module').then(m => m.RecibirRemesaModule),
    // },
    // {
    //     path: 'consultar-remesa',
    //     data: { title: 'Consultar Remesa' },
    //     loadChildren: () => import('./remesa/consultar-remesa/consultar-remesa.module').then(m => m.ConsultarRemesaModule),
    // },

    {
        path: 'reporte-agencia-operativa',
        data: { title: 'Reporte Agencia Operativa' },
        loadChildren: () => import('./reports/agencia-operativa/reporte-agencia-operativa.module').then(m => m.ReporteAgenciaOperativaModule),
    },
    {
        path: 'reporte-taquilla-operativa',
        data: { title: 'Reporte Taquilla Operativa' },
        loadChildren: () => import('./reports/taquilla-operativa/reporte-taquilla-operativa.module').then(m => m.ReporteTaquillaOperativaModule),
    },
    {
        path: 'reporte-cupo-agencia',
        data: { title: 'Reporte Cupo Agencia' },
        loadChildren: () => import('./reports/cupo-agencia/reporte-cupo-agencia.module').then(m => m.ReporteCupoAgenciaModule),
    },
    {
        path: 'reporte-cierre-taquilla',
        data: { title: 'Reporte Cierre Taquilla' },
        loadChildren: () => import('./reports/cierre-taquilla/reporte-cierre-taquilla.module').then(m => m.ReporteCierreTaquillaModule),
    },
    {
        path: 'reporte-cuadre-taquilla',
        data: { title: 'Reporte Cuadre Taquilla' },
        loadChildren: () => import('./reports/cuadre-taquilla/reporte-cuadre-taquilla.module').then(m => m.ReporteCuadreTaquillaModule),
    },
    {
        path: 'reporte-cierre-agencia',
        data: { title: 'Reporte Cierre Agencia' },
        loadChildren: () => import('./reports/cierre-agencia/reporte-cierre-agencia.module').then(m => m.ReporteCierreAgenciaModule),
    },
    {
        path: 'reporte-cuadre-agencia',
        data: { title: 'Reporte Cuadre Agencia' },
        loadChildren: () => import('./reports/cuadre-agencia/reporte-cuadre-agencia.module').then(m => m.ReporteCuadreAgenciaModule),
    },
    {
        path: 'reporte-remesas-solicitadas',
        data: { title: 'Reporte Remesas Solicitadas' },
        loadChildren: () => import('./reports/remesa-solicitada/reporte-remesa-solicitada.module').then(m => m.ReporteRemesaSolicitadaModule),
    },
    {
        path: 'reporte-remesas-enviadas',
        data: { title: 'Reporte Remesas Enviadas' },
        loadChildren: () => import('./reports/remesa-enviada/reporte-remesa-enviada.module').then(m => m.ReporteRemesaEnviadaModule),
    },
    {
        path: 'reporte-remesas-recibidas',
        data: { title: 'Reporte Remesas Recibidas' },
        loadChildren: () => import('./reports/remesa-recibida/reporte-remesa-recibida.module').then(m => m.ReporteRemesaRecibidaModule),
    },
    {
        path: 'reporte-atm',
        data: { title: 'Reporte de Atm' },
        loadChildren: () => import('./reports/atm/reporte-atm.module').then(m => m.ReporteAtmModule),
    },

];



@NgModule({
    imports: [RouterModule.forChild(controlEfectivoRoutes)],
    exports: [RouterModule]
})
export class ControlEfectivoRoutingModule {
}
