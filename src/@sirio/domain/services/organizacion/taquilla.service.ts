import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Taquilla {
    id: number;
    nombre: string;
    usuario: string;
    abierta: number;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class TaquillaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_ORGANIZACION, prefix: '/taquilla'};
    }

    actives(): Observable<Taquilla[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    activesWithUser(): Observable<Taquilla[]> {
        return this.apiService.config(this.apiConfig).get('/withuser/actives');
    }

    get(id: number): Observable<Taquilla> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    isOpen(): Observable<any> {
        return this.apiService.config(this.apiConfig).get('/isopen');
    }

    getByUsuario(): Observable<Taquilla> {
        return this.apiService.config(this.apiConfig).get('/byusuario/get');
    }

    detail(id: string): Observable<Taquilla> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Taquilla[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: Taquilla): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Taquilla): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

    open(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/open`);
    }
    
    close(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/close`);
    }

}
