import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface SaldoTaquilla {
    id: number;
    taquilla: number;
    fecha: any;
    ingreso: number;  
    egreso: number;
    transito: number;
    saldo: number;
    diferencia: number;
    moneda: string;
    cerrado: any;
}

@Injectable({
    providedIn:'root'
})
export class SaldoTaquillaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/saldo-taquilla'};
    }

    getSaldoByMoneda(moneda: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/saldo`);
    }

    getSaldoByMonedaAndTaquilla(moneda: string, taquilla: number): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/moneda/${taquilla}/taquilla/saldo`);
    }

    allByTaquilla(taquilla: number): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${taquilla}/taquilla/list`);
    }

    allByAgencia(): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/byagencia/list`);
    }

    all(): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/list`);
    }
    

}
