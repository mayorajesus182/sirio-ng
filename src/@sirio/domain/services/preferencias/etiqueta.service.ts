import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface Etiqueta {
    etiqueta: string;
    idioma: string;
    nombre: string;
}

@Injectable(
    {
        providedIn: 'root'
    })
export class EtiquetaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_PREFERENCIA, prefix: '/etiqueta' };
    }

    actives(): Observable<Etiqueta[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }


}
