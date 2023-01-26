import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const autorizacionRoutes: Routes = [

    {
        path: 'usuarios',
        data: { title: 'Usuarios' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
    },
    {
        path: 'perfiles',
        data: { title: 'Perfiles' },
        loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule),
    },
    // {
    //     path: 'roles',
    //     data: { title: 'Roles' },
    //     loadChildren: () => import('./rol/rol.module').then(m => m.RolModule),
    // }

];



@NgModule({
    imports: [RouterModule.forChild(autorizacionRoutes)],
    exports: [RouterModule]
})
export class AutorizacionRoutingModule {
}
