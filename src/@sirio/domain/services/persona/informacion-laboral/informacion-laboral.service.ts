import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface InformacionLaboral {
    id: string;   
    persona: string;
    tipoIngreso: string;
    remuneracion: string;
    empresa: string;
    tipoDocumento?: string;
    identificacion: string;
    fecha:  any;
    actividadIndependiente?: string;
    ramo?: string;
    registro?: string;
    numero?: string;
    tomo?: string;
    folio?: string;
    profesion?: string;    
    direccion: string;
    telefono: string;
}


@Injectable({
    providedIn:'root'
})
export class InformacionLaboralService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/informacion-laboral'};
    }

    allByPersonaId(id:number): Observable<InformacionLaboral[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }

    actives(): Observable<InformacionLaboral[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(id: number): Observable<InformacionLaboral> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<InformacionLaboral> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: InformacionLaboral): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: InformacionLaboral): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    delete(id: number): Observable<InformacionLaboral> {
        return this.apiService.config(this.apiConfig).put(`/${id}/delete`);
    }


}