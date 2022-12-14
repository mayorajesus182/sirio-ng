import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface SaldoRegional {

    agencia: string;

    agenciaNombre: string;

    // @Column(name = "region_id")
    // private String region;

    // @Column(name = "region")
    // private String regionNombre;

    // @Column(name = "siglas")
    // private String siglas;

    // @Column(name = "moneda_id")
    // private String moneda;

    // @Column(name = "moneda")
    // private String monedaNombre;

    saldo: number;

    minimo: number;


    maximo: number;

    excedente: number;
    excedentePorcentual: number;
}

@Injectable({
    providedIn: 'root'
})
export class SaldoRegionalService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/saldo-regional' };
    }


    datachart(): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/datachart`);
    }


}
