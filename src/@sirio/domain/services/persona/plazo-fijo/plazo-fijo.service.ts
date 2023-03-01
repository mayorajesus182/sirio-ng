import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface PlazoFijo {
    id: number;
    persona: number;
    cuentaBancoCargo: number;
    fecha: any;
    tipoSubproducto: string;
    moneda: string;
    plazo: string;
    fechaVencimiento: any;
    monto: number;
    interes: number;    
    tasa: number;
    cuentaBancoCapital: number;
    cuentaBancoInteres: number;
    renovacion: number;
    tipoRenovacion: string;
    estatus: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class PlazoFijoService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/plazo-fijo'};
    }

    get(id: string): Observable<PlazoFijo> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    getByExpediente(expediente: string): Observable<PlazoFijo> {
        return this.apiService.config(this.apiConfig).get(`/${expediente}/by-expediente/get`);
    }

    detailByExpediente(expediente: string): Observable<PlazoFijo> {
        return this.apiService.config(this.apiConfig).get(`/${expediente}/by-expediente/detail`);
    }

    detail(id: string): Observable<PlazoFijo> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<PlazoFijo[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    pageByParams(filter = '', sortPropertie = 'id', sortOrder = 'asc', pageNumber = 0, pageSize = 15, paramsOpts: any = {}): Observable<PlazoFijo[]> {
        const params = new HttpParams().set('filter', filter)
            .set('sortby', sortPropertie)
            .set('direction', sortOrder)
            .set('page', pageNumber.toString())
            .set('size', pageSize.toString());
        return this.apiService.config(this.apiConfig).get('/page', params, paramsOpts);
    }

    save(data: PlazoFijo): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: PlazoFijo): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    updateTasaMontoStatus(data: any): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/tasa-monto-status/update`, data)
            .pipe(map(res => data));
    }

}
