import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface InformacionLaboral {
    id: string;
   
    persona: String;

    tipoIngreso: String;

    remuneracion: String;

    empresa: String;

    tipoDocumento?: String;

    identificacion: String;

    fecha:  any;

    actividadIndependiente?: String;

    ramo?: String;
    registro?: String;
    tomo?: String;
    folio?: String;

    cargo?: String;
    
    direccion: String;
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

}