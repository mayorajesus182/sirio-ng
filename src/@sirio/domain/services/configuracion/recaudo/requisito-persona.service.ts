import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface RequisitoPersona {
    tipoPersona: string;
    seccion: string;
    cantidad: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class RequisitoPersonaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONFIGURACION, prefix: '/recaudo/requisito-persona'};
    }

    all(): Observable<RequisitoPersona[]> {
        return this.apiService.config(this.apiConfig).get('/all');
    }

    get(tipoPersona: string, seccion: string): Observable<RequisitoPersona> {
        return this.apiService.config(this.apiConfig).get(`/${tipoPersona}/${seccion}/get`);
    }

    update(data: RequisitoPersona[]): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/update`, data)
            .pipe(map(res => data));
    }



}
