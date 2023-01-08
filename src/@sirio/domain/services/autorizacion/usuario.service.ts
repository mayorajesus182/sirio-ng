import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';
import { Perfil } from './perfil.service';
import { Rol } from '../workflow/rol.service';


export interface Usuario {
    id: string;
    nombre: string;
    identificacion: string;
    email: string;
    ldap: number;
    perfil: Perfil;
    ROL: Rol;
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


    pageActives(filter = '', sortPropertie = 'id', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).page('/page/actives', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    existsLdap(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/ldap/exists`);
    }

    existsEmail(email: string, id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${email}/${id}/exists/email`);
    }

    actives(): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
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

    page(filter = '', sortProperty = 'usuario_id', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Usuario[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortProperty, sortOrder);
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

}
