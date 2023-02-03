import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ConoMonetario } from '../configuracion/divisa/cono-monetario.service';


export interface Retiro {
 
    //institucion: string;
   // agencia: string;
    persona?: number; 
    numper: string;
    cuentaBancaria: number;   
    tipoDocumento: string; 
    tipoDocumentoCheque: string; 
    identificacion: string ;  
    nombre: string ;  
    numeroCuenta: string;
    moneda: String;
    tipoProducto: string;     
    serialCheque: string;
    fechaEmision: any;
    codSeguridad: string;
    montoCheque: number ;
    monto: number;
    tipoDocumentoBeneficiario: String ;
    identificacionBeneficiario: String ;
    nombreBeneficiario: String ;
    // tipoDocumentoBeneficiario: string; 
    // identificacionBeneficiario: string;  
    libreta: string;
    linea: string;
    // conoAnterior: number;
    telefono?: string;
    email:string;
    comprador: string;
    // beneficiario: string;
    detalles:ConoMonetario[];
    operacion?:'efectivo' | 'cheque' | 'cheque-gerencia' ;
    conAbonoCta?: Boolean;
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
        this.apiConfig = {name: ApiConfConstants.API_TAQUILLA, prefix: '/retiro-new'};    
    }
    

    save(data: Retiro): Observable<any> {       
        return this.apiService.config(this.apiConfig).post(`/${data.operacion}/create`, data)
            .pipe(map(res => data));
    }

   
}
