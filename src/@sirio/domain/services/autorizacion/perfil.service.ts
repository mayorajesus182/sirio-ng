import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Perfil {
    id: string;
    nombre: string;
    descripcion: string;
    fechaCreacion?: any;
    activo?: boolean;
    maqueta: boolean;
    permisos: any[];
}

@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_AUTORIZACION, prefix: '/perfil' };
    }

    list(): Observable<Perfil[]> {
        return this.apiService.config(this.apiConfig).get('/list');
    }

    actives(): Observable<Perfil[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }


    page(filter = '', sortPropertie = 'perfil_id', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Perfil[]> {

        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    pageActives(filter = '', sortPropertie = 'perfil_id', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Perfil[]> {

        return this.apiService.config(this.apiConfig).page('/page/actives', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    get(id: string): Observable<Perfil> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }


    changeStatus(id: any): Observable<any> {
        const params = new HttpParams().set('id', id);
        return this.apiService.config(this.apiConfig).get('/status/update', params);
    }

    save(data: Perfil): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Perfil): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }


    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    existsName(nombre: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${nombre}/exists/name`);
    }



}
