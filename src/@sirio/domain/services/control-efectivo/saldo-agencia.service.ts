import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface SaldoAgencia {
    id: number;
    agencia: string;
    fecha: any;
    saldoInicial: number;
    ingreso: number;  
    egreso: number;
    transito: number;
    deposito: number;
    retiro: number;
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
export class SaldoAgenciaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/saldo-agencia'};
    }

    getSaldo(): Observable<any> {
        return this.apiService.config(this.apiConfig).get('/list');
    }

    getSaldoByMoneda(moneda: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/saldo`);
    }

    getSaldoByMonedaAndAgencia(moneda: string, agencia: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/moneda/${agencia}/agencia/saldo`);
    }

    allByAgencia(agencia: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${agencia}/agencia/list`);
    }

    all(): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/list`);
    }

    datachart(): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/datachart`);
    }

    allWithMovements(): Observable<SaldoAgencia[]> {
        return this.apiService.config(this.apiConfig).get(`/conmovimiento/list`);
    }

}
