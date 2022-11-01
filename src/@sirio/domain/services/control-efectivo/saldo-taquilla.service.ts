import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface SaldoTaquilla {
    id: number;
    taquilla: number;
    taquillaNombre?: string;
    taquillaUsuario?: string;
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
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/saldo-taquilla'};
    }

    getSaldoByMoneda(moneda: string): Observable<number> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/saldo`);
    }

    getSaldoByMonedaAndTaquilla(moneda: string, taquilla: number): Observable<number> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/moneda/${taquilla}/taquilla/saldo`);
    }

    allByTaquilla(taquilla: number): Observable<SaldoTaquilla> {
        return this.apiService.config(this.apiConfig).get(`/${taquilla}/taquilla/list`);
    }

    allByAgencia(): Observable<SaldoTaquilla[]> {
        return this.apiService.config(this.apiConfig).get(`/byagencia/list`);
    }

    all(): Observable<SaldoTaquilla[]> {
        return this.apiService.config(this.apiConfig).get(`/list`);
    }
    

}
