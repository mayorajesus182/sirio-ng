import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';

export interface Persona {
    tipoDocumento: String;
    
    identificacion: String;
   
    primerNombre: String;

    segundoNombre: String;
    
    primerApellido: String;

    segundoApellido: String;

    fechaNacimiento: Date;
 
    pais: String;

    nacionalidad: String;

    otraNacionalidad: String;

    telefono: String;

    genero: String;

    profesion: String;

    tenencia: String;

    cargaFamiliar: Integer;

    estadoCivil: String;

     conyuge: String;

    tipoDocumentoConyuge: String;

    identificacionConyuge: String;

    nombreConyuge: String;

    fuenteIngreso: String;

    email: String;

    estatusPersona: String;

    actividadEspecifica: String;
}

@Injectable({
    providedIn:'root'
})
export class PersonaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONFIGURACION, prefix: '/persona/persona-natural'};
    }

    all(): Observable<Persona[]> {
        return this.apiService.config(this.apiConfig).get('/all');
    }

    actives(): Observable<Persona[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    get(id: string): Observable<Persona> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<Persona> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Persona[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: Persona): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Persona): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}