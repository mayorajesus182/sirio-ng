import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZonaDetailComponent } from './detail/zona-detail.component';
import { ZonaFormComponent } from './form/zona-form.component';
import { ZonaTableComponent } from './table/zona-table.component';


const zonaRoutes: Routes = [

    {
        path: '',
        component: ZonaTableComponent,
        data: { title: 'Zonas' }
    },
    {
        path: 'add',
        component: ZonaFormComponent,
        data: { title: 'Crear Zona' }
    },
    {
        path: ':id/edit',
        component: ZonaFormComponent,
        data: { title: 'Editar Zona' }
    },
    {
        path: ':id/view',
        component: ZonaDetailComponent,
        data: { title: 'Visualizar Zona' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(zonaRoutes)],
    exports: [RouterModule]
})
export class ZonaRoutingModule {
}

