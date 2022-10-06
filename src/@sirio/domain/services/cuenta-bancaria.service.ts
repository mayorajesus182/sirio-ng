import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface CuentaBancaria {
    id: number;
    institucion: string;
    agencia: number;
    persona:number;
    numper: string;
    cuentaBancaria: number;
    tipoDocumento: string;
    identificacion: string;
    nombre: string;
    numeroCuenta: string;
    moneda: string;
    tipoProducto: string;
    referencia: string;
    efectivo: number;
    chequePropio: number;
    cantidadPropio: number;
    chequeOtros: number;
    cantidadOtros: number;
    conoAnterior: number;
    monto: number;
    libreta: string;
    linea: string;
    telefono: string;
    email: string;
    estatusOperacion: string;

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

    
}
