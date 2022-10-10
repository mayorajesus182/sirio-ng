import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface CuentaBancariaOperacion {
    id: number;
    numeroCuenta: string;
    moneda: string;
    tipoProducto: string;
}

export interface CuentaBancaria {
    id: number;
    numeroCuenta: string;
    descripcion: string;
    moneda: string;
    tipoProducto: string;
}

@Injectable({
    providedIn:'root'
})
export class CuentaBancariaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PASIVO, prefix: '/cuenta-bancaria'};
    
    }

    activesByPersona(persona: string): Observable<CuentaBancaria[]> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/bypersona/all`);
    }

    activesByNumper(numper: string): Observable<CuentaBancaria[]> {
        return this.apiService.config(this.apiConfig).get(`/${numper}/bynumper/all`);
    }
    
}
