import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface Telefono {
    id: string;
   
    persona: string;

    tipoTelefono?: string;

    claseTelefono?: string;

    prefijo?: string;

    numero: string;

    principal: number;
}


export interface TelefonoExists {
    exists: any;
}


@Injectable({
    providedIn:'root'
})
export class TelefonoService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/telefono'};
    }

    allByPersonaId(id:number): Observable<Telefono[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }

    actives(): Observable<Telefono[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(id: number): Observable<Telefono> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    exist(id: number , telefono : String): Observable<TelefonoExists> {
        return this.apiService.config(this.apiConfig).get(`/${id}/${telefono}/get`);

    }

    detail(id: string): Observable<Telefono> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: Telefono): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Telefono): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    delete(id: number): Observable<Telefono> {
        return this.apiService.config(this.apiConfig).put(`/${id}/delete`);
    }


}
