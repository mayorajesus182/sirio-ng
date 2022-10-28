import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface Apoderado {
    id: string;
   
    persona: String;

    tipoDocumento: string;

    identificacion: string;

    nombre: string;

    registro: string;

    numero: string;

    tomo: string;

    folio: string;

    fecha?: any;
}


@Injectable({
    providedIn:'root'
})
export class ApoderadoService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/apoderado'};
    }

    allByPersonaId(id:number): Observable<Apoderado[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }

    actives(): Observable<Apoderado[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(id: number): Observable<Apoderado> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<Apoderado> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: Apoderado): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Apoderado): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

}