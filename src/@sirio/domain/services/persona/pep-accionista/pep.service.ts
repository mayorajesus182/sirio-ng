import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface PepAccionista {
    id: string;
    persona: String;
    accionista: String;
    tipoPep: String;   
    tipoDocumento: string;
    identificacion?: string;
    nombre: String;
    ente: String;
    cargo: String;
    pais?: String;
}


@Injectable({
    providedIn:'root'
})
export class PepAccionistaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/pep-accionista'};
    }

    allByPersonaId(id:number): Observable<PepAccionista[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }

    actives(): Observable<PepAccionista[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(id: number): Observable<PepAccionista> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<PepAccionista> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: PepAccionista): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: PepAccionista): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    delete(id: number): Observable<PepAccionista> {
        return this.apiService.config(this.apiConfig).put(`/${id}/delete`);
    }

}