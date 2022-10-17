import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface TipoAtm {
    id: string;
    nombre: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class TipoAtmService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONFIGURACION, prefix: '/tipo-atm'};
    }
    
    actives(): Observable<TipoAtm[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

}
