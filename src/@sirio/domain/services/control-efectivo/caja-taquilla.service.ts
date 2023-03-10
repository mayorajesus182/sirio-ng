import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ConoMonetario } from '../configuracion/divisa/cono-monetario.service';

export interface CajaTaquilla {
    id: number;
    taquilla: number;
    nombreTaquilla?: string;
    movimientoEfectivo: string;     
    monto: number;
    moneda: string;
    siglasMoneda?: string;
    nombreMoneda?: string;
    diferencia?: number;
    ajuste?: number;
    fechaCreacion?: any;
    detalleEfectivo: any[];
}

@Injectable({
    providedIn:'root'
})
export class CajaTaquillaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/caja-taquilla'};
    }

    get(id: number): Observable<CajaTaquilla> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    getByExpediente(expediente: string): Observable<CajaTaquilla> {
        return this.apiService.config(this.apiConfig).get(`/${expediente}/byexpediente/get`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<CajaTaquilla[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    detail(id: string): Observable<CajaTaquilla> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    detailByExpediente(expediente: string): Observable<CajaTaquilla> {
        return this.apiService.config(this.apiConfig).get(`/${expediente}/byexpediente/detail`);
    }

    allByExpediente(expediente: string): Observable<CajaTaquilla[]> {
        return this.apiService.config(this.apiConfig).get(`/${expediente}/byexpediente/list`);
    }

    save(data: CajaTaquilla): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: CajaTaquilla): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

}
