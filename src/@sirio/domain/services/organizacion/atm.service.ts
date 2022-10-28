import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface Atm {
    id: string;
    codigo: string;
    moneda: string;
    tipoAtm: string;
    agencia: string;
    transportista: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class AtmService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_ORGANIZACION, prefix: '/atm'};
    }

    actives(): Observable<Atm[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    activesByAgencia(agencia: string): Observable<Atm[]> {
        return this.apiService.config(this.apiConfig).get(`/${agencia}/byagencia/actives`);
    }

    activesByTransportista(transportista: string): Observable<Atm[]> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/bytransportista/actives`);
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    existsByCodigo(codigo: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${codigo}/bycodigo/exists`);
    }

    get(id: string): Observable<Atm> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<Atm> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Atm[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    pageByAgencia(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Atm[]> {
        return this.apiService.config(this.apiConfig).page('/byagencia/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: Atm): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Atm): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}
