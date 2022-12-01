import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface Pep {
    id: string;
   
    persona: String;

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
export class PepService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/pep'};
    }

    allByPersonaId(id:number): Observable<Pep[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }

    actives(): Observable<Pep[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(id: number): Observable<Pep> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<Pep> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: Pep): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Pep): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    delete(id: number): Observable<Pep> {
        return this.apiService.config(this.apiConfig).put(`/${id}/delete`);
    }

}