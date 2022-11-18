import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface SaldoAcopio {
    id: number;
    transportista: string;
    fecha: any;
    saldoInicial: number;
    transito: number;
    remesaRecibida: number;
    remesaEnviada: number;
    retiroAtm: number;
    incrementoAtm: number;
    saldoFinal: number;
    moneda: string;
    cerrado: any;
}

@Injectable({
    providedIn:'root'
})
export class SaldoAcopioService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/saldo-acopio'};
    }

    getSaldoByMoneda(moneda: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/saldo`);
    }

    getSaldoByMonedaAndTransportista(moneda: string, transportista: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/moneda/${transportista}/acopio/saldo`);
    }

    allByTransportista(transportista: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/transportista/list`);
    }

    allWithMovements(): Observable<SaldoAcopio[]> {
        return this.apiService.config(this.apiConfig).get(`/conmovimiento/list`);
    }

}
