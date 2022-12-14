import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Usuario {
    id: string;
    nombre: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class UsuarioService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_AUTORIZACION, prefix: '/usuario'};
    }

    actives(): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    gerenteRegionalPorAsignar(): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).get('/gerenteregional/porasinar/list');
    }   

    gerenteRegionalActives(): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).get('/gerenteregional/actives');
    }   

    gerenteAgenciaActives(): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).get('/gerenteagencia/actives');
    }   

    oficinaPrincipalActives(): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).get('/principal/actives');
    }  

    transportistaActives(): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).get('/transportista/actives');
    }  

    taquillaRolAactives(): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).get('/with-rol/actives');
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    get(id: string): Observable<Usuario> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<Usuario> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: Usuario): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Usuario): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}
