import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';

export interface PersonaJuridica {
    id: number;
    numper: string;
    tipoDocumento: string;
    nombre: string;
    identificacion: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;

    razonSocial: string;
    nombreComercial: string;
    web: string;

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
    tipoDocumentoConyuge: string;
    identificacionConyuge: string;
    nombreConyuge: string;
    fuenteIngreso: string;
    email: string;
    estatusPersonaNatural: string;
    actividadEspecifica: string;
    actividadEconomica?: string;
    categoriaEspecial?: string;

    anhoDeclaracion: string;

    montoDeclarado: string;

    oficinas: string;
        
    empleados: string;
        
    ventas: string;

    ingresos: string;
        
    egresos: string;

}

@Injectable({
    providedIn:'root'
})
export class PersonaJuridicaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/juridica'};
    }


    actives(): Observable<PersonaJuridica[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    get(id: number): Observable<PersonaJuridica> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    getByNumper(numper: string): Observable<PersonaJuridica> {
        return this.apiService.config(this.apiConfig).get(`/${numper}/bynumper/get`);
    }

    // detail(id: string): Observable<PersonaNatural> {
    //     return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    // }


    save(data: PersonaJuridica): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => Object.assign(res, data)));
    }

    update(data: PersonaJuridica): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}