import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CifraPromedioDetailComponent } from './detail/cifra-promedio-detail.component';
import { CifraPromedioFormComponent } from './form/cifra-promedio-form.component';
import { CifraPromedioTableComponent } from './table/cifra-promedio-table.component';


const cifraPromedioRoutes: Routes = [

    {
        path: '',
        component: CifraPromedioTableComponent,
        data: { title: 'Cifras Promedio' }
    },
    {
        path: 'add',
        component: CifraPromedioFormComponent,
        data: { title: 'Crear Cifra Promedio' }
    },
    {
        path: ':id/edit',
        component: CifraPromedioFormComponent,
        data: { title: 'Editar Cifra Promedio' }
    },
    {
        path: ':id/view',
        component: CifraPromedioDetailComponent,
        data: { title: 'Visualizar Cifra Promedio' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(cifraPromedioRoutes)],
    exports: [RouterModule]
})
export class CifraPromedioRoutingModule {
}

