import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface Moneda {
    moneda: string;
    id: string;
    nombre: string;
    siglas: string;
    codigoLocal: string;
    usoOperacion: number;
    usoAtm: number;
    esVirtual: number;
    divisor?: number;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class MonedaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONFIGURACION, prefix: '/divisa/moneda'};
    }

    actives(): Observable<Moneda[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    get(id: string): Observable<Moneda> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<Moneda> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Moneda[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: Moneda): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Moneda): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

    paraOperacionesActives(): Observable<Moneda[]> {
        return this.apiService.config(this.apiConfig).get('/foroperation/actives');
    }

    paraAtmActives(): Observable<Moneda[]> {
        return this.apiService.config(this.apiConfig).get('/foratm/actives');
    }

    fisicaActives(): Observable<Moneda[]> {
        return this.apiService.config(this.apiConfig).get('/fisicas/actives');
    }
    
    virtualActives(): Observable<Moneda[]> {
        return this.apiService.config(this.apiConfig).get('/virtuales/actives');
    }
    
    forRemesasAll(): Observable<Moneda[]> {
        return this.apiService.config(this.apiConfig).get('/forremesas/list');
    }
    
    forSolicitudRemesasAll(): Observable<Moneda[]> {
        return this.apiService.config(this.apiConfig).get('/forsolicitud/remesas/list');
    }

    forEnvioRemesasAll(): Observable<Moneda[]> {
        return this.apiService.config(this.apiConfig).get('/forenvio/remesas/list');
    }
    
}
