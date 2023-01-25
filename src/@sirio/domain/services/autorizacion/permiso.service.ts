import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { SidenavItem } from 'src/app/layout/sidenav/sidenav-item/sidenav-item.interface';


export interface Permiso {
    id?: string;
    pathMatchExact?: boolean;
    customClass?: string;
    parent?: SidenavItem;
    label: string;
    view?: string;
    icon?: string;
    subpermisos?: Permiso[];// Dropdown items
}


@Injectable({
        providedIn: 'root'
})
export class PermisoService {
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_AUTORIZACION, prefix: '/permiso' };
    }

    tree(): Observable<Permiso[]> {
        return this.apiService.config(this.apiConfig).get('/tree');
    }

}
