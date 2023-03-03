import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface TipoSubproducto {
    id: string;
    tipoProducto: string;
    nombre: string;
    tipoPersona: string;
    moneda: string;
    monedaNombre?: string;
    codigoLocal: string;
    conChequera: number;
    conLibreta: number;
    tasa: number;
    minimo: number;
    maximo: number;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn: 'root'
})
export class TipoSubproductoService {

    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_CONFIGURACION, prefix: '/producto/tipo-subproducto' };
    }

    actives(): Observable<TipoSubproducto[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    get(id: string): Observable<TipoSubproducto> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<TipoSubproducto> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<TipoSubproducto[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: TipoSubproducto): Observable<any> {

        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: TipoSubproducto): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

    activesByTipoProductoAndTipoPersona(tipoProducto: string, tipoPersona: string): Observable<TipoSubproducto[]> {
        return this.apiService.config(this.apiConfig).get(`/${tipoProducto}/tipo-producto/${tipoPersona}/tipo-persona/actives`);
    }

    activesByTipoProductoAndTipoPersonaAndMoneda(tipoProducto: string, tipoPersona: string, moneda: string): Observable<TipoSubproducto[]> {
        return this.apiService.config(this.apiConfig).get(`/${tipoProducto}/${tipoPersona}/${moneda}/by-tipo-producto-tipo-persona-moneda/actives`);
    }

    activesByTipoProducto(tipoProducto: string): Observable<TipoSubproducto[]> {
        return this.apiService.config(this.apiConfig).get(`/${tipoProducto}/tipo-producto/actives`);
    }

}
