import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface ReferenciaPersonal {
    id: string;    
    persona: string,
    nombre: string,
    tipoDocumento: string,
    identificacion: string,
    telefonoFijo: string,
    telefonoMovil: string  
}


@Injectable({
    providedIn:'root'
})
export class ReferenciaPersonalService {
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/referencia-personal'};
    }

    allByPersonaId(id:number): Observable<ReferenciaPersonal[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }


    get(id: number): Observable<ReferenciaPersonal> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<ReferenciaPersonal> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: ReferenciaPersonal): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: ReferenciaPersonal): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

}

