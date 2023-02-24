import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface Persona{
    id: number;
    nombre: string;
    numper: string;
    tipoPersona?: string;
    tipoDocumento: string;
    identificacion?: string;
    direcciones?: number;
    cuentaMonedaPrincipal?: boolean;
    telefonos?: number;
    email?: string;
}

@Injectable({
    providedIn:'root'
})
export class PersonaService {
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: ''};
    }

    get(id: number): Observable<Persona> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    send(id: number): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/send`);
    }

    getByTipoDocAndIdentificacion(tipoDocumento: string, identificacion: string): Observable<Persona> {
        return this.apiService.config(this.apiConfig).get(`/${tipoDocumento}/${identificacion}/get`);
    }
    
    getByExpediente(expediente: string): Observable<Persona> {
        return this.apiService.config(this.apiConfig).get(`/${expediente}/by-expediente/get`);
    }

    getActivaByTipoDocAndIdentificacion(tipoDocumento: string, identificacion: string): Observable<Persona> {
        return this.apiService.config(this.apiConfig).get(`/${tipoDocumento}/${identificacion}/activa`);
    }


}