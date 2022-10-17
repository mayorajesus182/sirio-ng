import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Retiro {
 
    //institucion: string;
   // agencia: number;
    persona: number; 
    numper: string;
    cuentaBancaria: number;   
    tipoDocumento: string; 
    identificacion: string ;  
    nombre: string ;  
    numeroCuenta: string;
    moneda: String;
    tipoProducto: string;     
    serialCheque: string;
    fechaEmision: any;
    codSeguridad: string;
    montocheque: number ;
    monto: number;
    tipoDocumentoBeneficiario: string; 
    identificacionBeneficiario: string;  
    libreta: string;
    linea: string;
    conoAnterior: number;
    telefono: string;
    email:string;
    //estatusOperacion: string;
      
}

@Injectable({
    providedIn:'root'
})
export class RetiroService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_TAQUILLA, prefix: '/retiro'};
    
    }
    

    save(data: Retiro): Observable<any> {       
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

   
}
