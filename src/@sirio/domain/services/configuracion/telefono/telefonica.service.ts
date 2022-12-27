import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Telefonica {
    id: string;
    nombre: string;
    tipoTelefonica:string;
    codigoLocal: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class TelefonicaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONFIGURACION, prefix: '/telefono/telefonica'};
    }

    actives(): Observable<Telefonica[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    activesByClaseTelefono(clase: string): Observable<Telefonica[]> {
        return this.apiService.config(this.apiConfig).get(`/${clase}/byclasetelefono/actives`);
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    get(id: string): Observable<Telefonica> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<Telefonica> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Telefonica[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: Telefonica): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Telefonica): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}
