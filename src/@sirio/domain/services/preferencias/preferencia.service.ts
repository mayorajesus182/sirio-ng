import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface Parametro{
    label: string;
    descripcion: string;
    placeholder: string
    value: string;
    categoria: string;
}


export interface Preferencia {    
    
    monedaConoActual:string;
    monedaSiglasConoActual:string;

    monedaConoAnterior:string;
    monedaSiglasConoAnterior:string;
    digitosPlomo:number;

    divisorConoAnterior:number;
    restriccionEquipo:number;
    cajetinesATM:number;
    movimientosImprimir:number;
    ajusteTaquilla:number;
}

@Injectable({
    providedIn:'root'
})
export class PreferenciaService {
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PREFERENCIA, prefix: ''};
    }

    actives(): Observable<Preferencia[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    // get(): Observable<Preferencia> {
    //     return this.apiService.config(this.apiConfig).get(`/get`);
    // }

    detail(): Observable<Preferencia> {
        return this.apiService.config(this.apiConfig).get(`/detail`);
    }

    get(): Observable<any []> {
        return this.apiService.config(this.apiConfig).get(`/get`);
    }

    parametros(): Observable<any> {
        return this.apiService.config(this.apiConfig).get(``);
    }


}
