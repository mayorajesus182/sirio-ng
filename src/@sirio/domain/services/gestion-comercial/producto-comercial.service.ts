import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface ProductoComercial {
    id: number;
    nombre: string;
    tipoPersona: string;
    tipo: string;
    parent?: ProductoComercial;
    subservicios?: ProductoComercial[];
}

@Injectable({
    providedIn: 'root'
})
export class ProductoComercialService {

    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_GESTION_COMERCIAL, prefix: '/producto-comercial' };
    }


    activesByTipoPersonaAndMoneda(tipoPersona: string, moneda: string): Observable<ProductoComercial[]> {
        return this.apiService.config(this.apiConfig).get(`/${tipoPersona}/tipopersona/${moneda}/moneda/actives`);
    }

    activesByTipoPersona(tipoPersona: string): Observable<ProductoComercial[]> {
        return this.apiService.config(this.apiConfig).get(`/${tipoPersona}/tipopersona/actives`);
    }

    asignedToPersona(persona: number): Observable<ProductoComercial[]> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/asigned/all`);
    }

    noAsignedToPersona(persona:number, tipoPersona: string): Observable<ProductoComercial[]> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/${tipoPersona}/no/asigned/all`);
    }


}
