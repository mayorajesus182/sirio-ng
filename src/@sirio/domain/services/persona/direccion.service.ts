import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface Direccion {
    id: string;
   
    persona: String;

    tipoDireccion: String;

    parroquia: String 
    municipio?: String 
    estado?: String 

    zonaPostal: String;

    via: String ;

    nombreVia: String;

    nucleo: String;

    nombreNucleo: String;

    construccion: String;

    estadonombreCostruccion: String;

    referencia: String;
}

@Injectable({
    providedIn:'root'
})
export class DireccionService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/direccion'};
    }

    allByPersonaId(id:number): Observable<Direccion[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }

    actives(): Observable<Direccion[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(id: number): Observable<Direccion> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<Direccion> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: Direccion): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Direccion): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

}