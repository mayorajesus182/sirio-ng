import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface TipoTelefonica {
    id: string;
    nombre: string;
    codigoLocal: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class TipoTelefonicaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONFIGURACION, prefix: '/telefono/tipo-telefonica'};
    }

    actives(): Observable<TipoTelefonica[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

}
