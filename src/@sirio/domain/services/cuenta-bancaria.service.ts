import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface CuentaBancariaOperacion extends CuentaBancaria{    
    
    identificacion: string;  
    nombre: string;
    persona: number;
    tipoProductoNombre: string;
    tipoDocumento: string;
    moneda: string;
    monedaNombre: string;
    siglas : string;
    email?:string;

}

export interface CuentaBancaria {  
    id: number; 
    numeroCuenta: string;
    descripcion: string;
    moneda: string;
    monedaNombre: string;
    tipoProducto: string;
    numper : string;
    siglas : string;

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

    activesByPersona(persona: number): Observable<CuentaBancaria[]> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/bypersona/all`);
    }

   

    activesByNumeroCuenta(numeroCuenta: string): Observable<CuentaBancariaOperacion> {
        return this.apiService.config(this.apiConfig).get(`/${numeroCuenta}/get`);
    }

    activesByNumper(numper: string): Observable<CuentaBancaria[]> {
        return this.apiService.config(this.apiConfig).get(`/${numper}/bynumper/all`);
    }

    
}
