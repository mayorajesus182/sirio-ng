import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface Persona{
    id: number;
    nombre: string;
    numper: string;
    tipoDocumento: string;
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
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: ''};
    }

    get(id: number): Observable<Persona> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    getByTipoDocAndIdentificacion(tipoDocumento: string, identificacion: string): Observable<Persona> {
        return this.apiService.config(this.apiConfig).get(`/${tipoDocumento}/${identificacion}/get`);
    }


}