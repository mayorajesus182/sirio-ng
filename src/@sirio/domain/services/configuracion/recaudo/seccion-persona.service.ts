import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface SeccionPersona {
    id: string;
    nombre: string;
    fechaCreacion?: any;
}

@Injectable({
    providedIn:'root'
})
export class SeccionPersonaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONFIGURACION, prefix: '/recaudo/seccion-persona'};
    }

    actives(): Observable<SeccionPersona[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

}
