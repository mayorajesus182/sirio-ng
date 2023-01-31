import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface Permiso {
    id?: string;
    // parent?: Permiso;
    label: string;
    view?: string;
    icon?: string;
    parent?: string;
    checked?: boolean;
    level?:number;
    ordination?:number;
    expandable?:boolean;
    children?: Permiso[];
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
