import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Expediente {
    id: string;
    objeto: string;
    fechaCreacion?: any;

}



@Injectable({
    providedIn:'root'
})
export class ExpedienteService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_WORKFLOW, prefix: '/expediente'};
    }

    get(id: string): Observable<Expediente> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

}
