import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface Interviniente {
    id: string;
   
    persona: String;

    tipoParticipacion: String;

    tipoFirma: String
    
    tipoFirmante?: String
}

@Injectable({
    providedIn:'root'
})
export class IntervinienteService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/interviniente'};
    }

    allByPersonaId(id:number): Observable<Interviniente[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }

    actives(): Observable<Interviniente[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(id: number): Observable<Interviniente> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<Interviniente> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: Interviniente): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Interviniente): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    delete(id: number): Observable<Interviniente> {
        return this.apiService.config(this.apiConfig).put(`/${id}/delete`);
    }

}