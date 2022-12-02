import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface AccionistaDirectivo {
    id: string;
    persona: String;
    tipoDocumento: string;
    identificacion: string;
    nombre: string;
    cargo: String;
    porcentaje: String;
    pepList: any[];
}


@Injectable({
    providedIn:'root'
})
export class AccionistaDirectivoService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/accionista-directivo'};
    }

    allByPersonaId(id:number): Observable<AccionistaDirectivo[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }

    actives(): Observable<AccionistaDirectivo[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(id: number): Observable<AccionistaDirectivo> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<AccionistaDirectivo> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: AccionistaDirectivo): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: AccionistaDirectivo): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    delete(id: number): Observable<AccionistaDirectivo> {
        return this.apiService.config(this.apiConfig).put(`/${id}/delete`);
    }

}