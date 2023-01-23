import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface CreditoComercial {
    id: number;
    nombre: string;
    tipoPersona: string;
    moneda: string;
    parent?: CreditoComercial;
    subservicios?: CreditoComercial[];
    monto: string;
    porcentaje: string;
    cuota: string;
    saldo: string;
    plazo: string;
    pendiente: string;
}

@Injectable({
    providedIn: 'root'
})
export class CreditoComercialService {

    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_GESTION_COMERCIAL, prefix: '/credito-comercial' };
    }


    activesByTipoPersonaAndMoneda(tipoPersona: string, moneda: string): Observable<CreditoComercial[]> {
        return this.apiService.config(this.apiConfig).get(`/${tipoPersona}/tipopersona/${moneda}/moneda/actives`);
    }

    activesByTipoPersona(tipoPersona: string): Observable<CreditoComercial[]> {
        return this.apiService.config(this.apiConfig).get(`/${tipoPersona}/tipopersona/actives`);
    }

    asignedToPersona(persona: number): Observable<CreditoComercial[]> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/asigned/all`);
    }

    noAsignedToPersona(persona:number, tipoPersona: string): Observable<CreditoComercial[]> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/${tipoPersona}/no/asigned/all`);
    }


}
