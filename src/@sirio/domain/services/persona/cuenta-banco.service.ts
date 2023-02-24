import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface CuentaBanco {
    id: number;
    persona: number;
    numeroCuenta: string;
    moneda: string;
    monedaVirtual: string;
    tipoSubproducto: string;
    origenFondo: string;
    destinoCuenta: string;
    motivoSolicitud: string;
    transaccionesCredito: string;
    montoDebito: string;
    transaccionesDebito: string;
    montoCredito: string;
    transaccionesElectronico: string;
    montoElectronico: string;
    fondoExterior: number;
    paisOrigen: string;
    paisDestino: string;
    tipoProducto: string;
    tipoParticipacion: string;
    tipoFirma: string    
    tipoFirmante: string
    observacion: string   
    montoPromedio: string;
}

@Injectable({
    providedIn:'root'
})
export class CuentaBancoService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/cuenta-banco'};
    }
    
    actives(): Observable<CuentaBanco[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }


    existsByPersonaAndMonedaPrincipal(persona: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/moneda-principal/cuenta/exists`);
    }

    get(id: number): Observable<CuentaBanco> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    getByPersona(persona: number): Observable<CuentaBanco> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/bypersona/get`);
    }

    getPrincipalByPersona(persona: number): Observable<CuentaBanco> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/cuenta-principal-by-persona/get`);
    }

    listByPersona(persona: number): Observable<CuentaBanco[]> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/bypersona/list`);
    }

    allByPersona(persona: number): Observable<CuentaBanco[]> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/by-persona/all`);
    }

    allByPersonaAndMoneda(persona: number, moneda:string): Observable<CuentaBanco[]> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/${moneda}/by-persona-moneda/all`);
    }

    getByNumper(numper: string): Observable<CuentaBanco> {
        return this.apiService.config(this.apiConfig).get(`/${numper}/bynumper/get`);
    }

    save(data: CuentaBanco): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data);
    }
    send(id:number): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${id}/send`);
    }

    update(data: CuentaBanco): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data);
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}