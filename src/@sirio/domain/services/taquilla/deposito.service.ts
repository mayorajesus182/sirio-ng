import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Deposito {
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
export class DepositoService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_TAQUILLA, prefix: '/deposito'};
    
    }

    save(data: Deposito): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

   
}
