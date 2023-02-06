import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface ConoMonetario {
    id: number;
    moneda: string;
    nombreMoneda?: string;
    denominacion: number;
    esBillete: number;
    cantidad?: number;
    disponible?: number;
    declarado?: number;
    enviado?: number;
    errors?: any;
    activo?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ConoMonetarioService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_CONFIGURACION, prefix: '/divisa/cono-monetario' };
    }


    actives(): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    activesByMoneda(moneda: string): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/actives`);
    }

    activesWithDisponibleSaldoPrincipalByMoneda(moneda: string): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/saldoprincipal/actives`);
    }

    activesWithDisponibleSaldoAcopioByMoneda(moneda: string): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/saldoacopio/actives`);
    }

    activesWithDisponibleSaldoAgenciaByMoneda(moneda: string): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/saldoagencia/actives`);
    }

    activesWithDisponibleSaldoAgenciaByAgenciaAndMoneda(agencia: string, moneda: string): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get(`/${agencia}/agencia/${moneda}/moneda/saldoagencia/actives`);
    }

    activesLastDisponibleSaldoAgenciaByAgenciaAndMoneda(agencia: string, moneda: string): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get(`/${agencia}/agencia/${moneda}/moneda/last/saldoagencia/actives`);
    }

    activesLastDisponibleSaldoAcopioByTransportistaAndMoneda(transportista: string, moneda: string): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/acopio/${moneda}/moneda/last/saldoacopio/actives`);
    }

    activesWorkflowWithDisponibleSaldoAgenciaByMoneda(moneda: string): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/saldoagencia/workflow/actives`);
    }

    activesWithDisponibleSaldoTaquillaByMoneda(moneda: string): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/saldotaquilla/actives`);
    }

    activesBilletesByMoneda(moneda: string): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/billetes/actives`);
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    existsSomethingByMoneda(moneda: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/something/exists`);
    }

    get(id: string): Observable<ConoMonetario> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<ConoMonetario> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<ConoMonetario[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: ConoMonetario): Observable<any> {

        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: ConoMonetario): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}
