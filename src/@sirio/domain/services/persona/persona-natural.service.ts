import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';

export interface PersonaNatural {
    id: number;
    numper: string;
    tipoDocumento: string;
    nombre: string;
    identificacion: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    fechaNacimiento: any;
    pais: string;
    nacionalidad: string;
    otraNacionalidad: string;
    telefono: string;
    genero: string;
    profesion: string;
    tenencia: string;
    cargaFamiliar: number;
    estadoCivil: string;
    conyuge: string;
    tipoDocumentoConyuge: string;
    identificacionConyuge: string;
    nombreConyuge: string;
    fuenteIngreso: string;
    email: string;
    estatusPersonaNatural: string;
    actividadEspecifica: string;
    actividadEconomica?: string;
    categoriaEspecial?: string;
}

@Injectable({
    providedIn:'root'
})
export class PersonaNaturalService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/natural'};
    }


    actives(): Observable<PersonaNatural[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    get(id: number): Observable<PersonaNatural> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    getByNumper(numper: string): Observable<PersonaNatural> {
        return this.apiService.config(this.apiConfig).get(`/${numper}/bynumper/get`);
    }

    // detail(id: string): Observable<PersonaNatural> {
    //     return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    // }


    save(data: PersonaNatural): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: PersonaNatural): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}