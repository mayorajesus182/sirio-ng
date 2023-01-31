import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface RegistroMercantil {
    id: string;
    persona: string;
    nombre: string;
    numero: string;
    tomo: string;
    folio: string;
    capitalSocial: string;
    ente: string;
    gaceta: string;
    decreto: string;
    fecha: any;
    codigoOnt: string;
}


@Injectable({
    providedIn:'root'
})
export class RegistroMercantilService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/registro-mercantil'};
    }

    allByPersonaId(id:number): Observable<RegistroMercantil[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }

    actives(): Observable<RegistroMercantil[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(id: number): Observable<RegistroMercantil> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<RegistroMercantil> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    save(data: RegistroMercantil): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: RegistroMercantil): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

}