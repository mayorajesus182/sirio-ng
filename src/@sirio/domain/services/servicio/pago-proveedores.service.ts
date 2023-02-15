import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Tipo_Servicio {

    ID: string;
    nombre: string;
    descripcion: string;
//     codigoSeguridad: string;
//     fechaEmision: any;
//     montoCheque: number;
//     // devolver: number;
//     motivoDevolucion: string;
//     // operacion?:'efectivo' | 'cheques' | 'mixto';
 }

export interface pago_proveedores {
   // id: number;
   id_cliente : number;
    //persona: number;
    afl_identificacion : string;
   // numper: string;
   // cuentaBancaria: number;
    //tipoDocumento: string;
    afl_tipoDocumento: string;
    afl_nombre: string;
   // identificacion: string;
  //  nombre: string;
    afl_numper: string;
    //numeroCuenta: string;
    //moneda: any;
    //email: string;
   // detalles: ConoMonetario[];


}
@Injectable({
    providedIn: 'root'
})
export class pago_proveedoresService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_SERVICIO, prefix: '/pago_proveedores' };
       console.log(this.apiConfig)
    }

    save(data: pago_proveedores): Observable<any> {
        return this.apiService.config(this.apiConfig).post(`/create`, data)
            .pipe(map(res => data));
    }


    get(): Observable<Tipo_Servicio[]> {
        return this.apiService.config(this.apiConfig).get(`/get`);
    }

    // get(id: string): Observable<Moneda> {
    //     return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    // }
    

}
