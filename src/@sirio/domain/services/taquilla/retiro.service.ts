import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Retiro {
 
    identificacion: string ;   
    nombre: string ;  
    numeroCuenta: string;
    monto: number;   
    referencia: string;
    libreta: string;
    linea: string;
    telefono: string;
    email:string;
    fechaCreacion?: any;
    activo?: number;
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
   
    get(id: string): Observable<Retiro> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    save(data: Retiro): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

   
}
