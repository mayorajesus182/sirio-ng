import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface DatoPersona {
    tipoPersona: string;
    seccion: string;
    cantidad: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class DatoPersonaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONFIGURACION, prefix: '/recaudo/dato-persona'};
    }

    exists(tipoPersona: string, seccion: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${tipoPersona}/${seccion}/exists`);
    }

    get(tipoPersona: string, seccion: string): Observable<DatoPersona> {
        return this.apiService.config(this.apiConfig).get(`/${tipoPersona}/${seccion}/get`);
    }

    detail(tipoPersona: string, seccion: string): Observable<DatoPersona> {
        return this.apiService.config(this.apiConfig).get(`/${tipoPersona}/${seccion}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<DatoPersona[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: DatoPersona): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: DatoPersona): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.tipoPersona}/${data.seccion}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(tipoPersona: string, seccion: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${tipoPersona}/${seccion}/status/update`);
    }

}
