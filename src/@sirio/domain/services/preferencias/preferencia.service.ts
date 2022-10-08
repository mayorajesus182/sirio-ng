import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface Preferencia {    
    
    monedaConoActual:string;

    monedaConoAnterior:string;

    divisorConoAnterior:number;
}

@Injectable({
    providedIn:'root'
})
export class PreferenciaService {
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PREFERENCIA, prefix: ''};
    }

    actives(): Observable<Preferencia[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(): Observable<Preferencia> {
        return this.apiService.config(this.apiConfig).get(`/get`);
    }


}
