import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface SaldoPrincipal {
    id: number;
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
    providedIn: 'root'
})
export class SaldoPrincipalService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/saldo-principal' };
    }

    datachart(): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/datachart`);
    }

    getSaldoSinDetalle(): Observable<SaldoPrincipal[]> {
        return this.apiService.config(this.apiConfig).get('/sin/detalle/list');
    }

}
