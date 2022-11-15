import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface CupoAgencia {
    moneda: string;
    nombreMoneda: string;    
    agencia:string;
    monto: number;
    solicitado?: number;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class CupoAgenciaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_ORGANIZACION, prefix: '/cupo-agencia'};
    }

    activesByAgencia(agencia: string): Observable<CupoAgencia[]> {
        return this.apiService.config(this.apiConfig).get(`/${agencia}/byagencia/actives`);
    }

    activesParaRemesa(): Observable<CupoAgencia[]> {
        return this.apiService.config(this.apiConfig).get(`/byagencia/forremesas/actives`);
    }

    update(data: CupoAgencia[]): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/update`, data)
            .pipe(map(res => data));
    }

}




