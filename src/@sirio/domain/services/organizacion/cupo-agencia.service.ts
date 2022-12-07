import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface CupoAgencia {
    moneda: string;
    nombreMoneda: string;
    agencia: string;
    maximo: number;
    minimo: number;
    excedentePorcentual: number;
    excedente: number;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn: 'root'
})
export class CupoAgenciaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_ORGANIZACION, prefix: '/cupo-agencia' };
    }

    getCupoByMoneda(moneda: string): Observable<CupoAgencia> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/cupo/get`);
    }

    activesByAgencia(agencia: string): Observable<CupoAgencia[]> {
        return this.apiService.config(this.apiConfig).get(`/${agencia}/byagencia/actives`);
    }

    activesParaRemesa(): Observable<CupoAgencia[]> {
        return this.apiService.config(this.apiConfig).get(`/byagencia/forremesas/actives`);
    }

    exists(agencia: string, moneda: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${agencia}/${moneda}/exists`);
    }

    update(data: CupoAgencia): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/update`, data).pipe(map(res => data));
    }

    delete(data: CupoAgencia): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/delete`, data).pipe(map(res => data));
    }

    save(data: CupoAgencia): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data).pipe(map(res => data));
    }

}




