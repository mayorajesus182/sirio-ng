import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface TipoServicio {
    id: string;
    nombre: string;
    tipoPersona: string;
    moneda: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn: 'root'
})
export class TipoServicioService {

    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_CONFIGURACION, prefix: '/tipo-servicio' };
    }

    actives(): Observable<TipoServicio[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    activesByTipoPersonaAndMoneda(tipoPersona: string, moneda: string): Observable<TipoServicio[]> {
        return this.apiService.config(this.apiConfig).get(`${tipoPersona}/tipopersona/${moneda}/moneda/actives`);
    }

    activesByTipoPersona(tipoPersona: string): Observable<TipoServicio[]> {
        return this.apiService.config(this.apiConfig).get(`${tipoPersona}/tipopersona/actives`);
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    get(id: string): Observable<TipoServicio> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<TipoServicio> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<TipoServicio[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: TipoServicio): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: TipoServicio): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}
