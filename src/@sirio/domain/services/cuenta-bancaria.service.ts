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
<<<<<<< HEAD
    id: number;   
    identificacion: string;  
    nombre: string;
    moneda: string;
    tipoProducto: string;
    descripcion: string ;
=======
    id: number;
    numeroCuenta: string;
    descripcion: string;
    moneda: string;
    tipoProducto: string;
>>>>>>> 623edea1f2d08e5420812a5c4ac401bdbeec8eb4
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

<<<<<<< HEAD
    activesByNumeroCuenta(numeroCuenta: string): Observable<CuentaBancaria> {
        return this.apiService.config(this.apiConfig).get(`/${numeroCuenta}/get`);
    }

=======
    activesByNumper(numper: string): Observable<CuentaBancaria[]> {
        return this.apiService.config(this.apiConfig).get(`/${numper}/bynumper/all`);
    }
>>>>>>> 623edea1f2d08e5420812a5c4ac401bdbeec8eb4
    
}
