import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface CuentaBancaria {
    identificacion: string;  
    nombre: string;
    moneda: string;
    id: number;   
    descripcion: string ;


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

    activesByNumeroCuenta(numeroCuenta: string): Observable<CuentaBancaria[]> {
        return this.apiService.config(this.apiConfig).get(`/${numeroCuenta}/get`);
    }

    
}
