import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface Parametro {
    label: string;
    descripcion: string;
    placeholder: string
    value: string;
    categoria: string;
    type: string;
    function: string;
    selectSimple: string;
    required: boolean;

}


export interface Preferencia {

    monedaConoActual: Parametro;
    monedaSiglasConoActual: Parametro;

    monedaConoAnterior: Parametro;
    monedaSiglasConoAnterior: Parametro;
    digitosPlomo: Parametro;

    divisorConoAnterior: Parametro;
    restriccionEquipo: Parametro;
    cajetinesATM: Parametro;
    movimientosImprimir: Parametro;
    // ajusteTaquilla: Parametro;
    ajusteFaltante: Parametro;
    ajusteSobrante: Parametro;
}

@Injectable({
    providedIn: 'root'
})
export class PreferenciaService {

    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_PREFERENCIA, prefix: '' };
    }

    actives(): Observable<Preferencia[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    active(): Observable<Preferencia> {
        return this.apiService.config(this.apiConfig).get('/active');
    }

    // get(): Observable<Preferencia> {
    //     return this.apiService.config(this.apiConfig).get(`/get`);
    // }

    detail(): Observable<Preferencia> {
        return this.apiService.config(this.apiConfig).get(`/detail`);
    }

    get(): Observable<any > {
        return this.apiService.config(this.apiConfig).get(`/get`);
    }

    // parametros(): Observable<any> {
    //     return this.apiService.config(this.apiConfig).get('');
    // }

    update(data: any): Observable<any> {
        return this.apiService.config(this.apiConfig).put('/update', data);
    }

    // update(data: Institucion): Observable<any> {
    //     return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
    //         .pipe(map(res => data));
    // }    


}
