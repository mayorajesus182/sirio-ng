import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface InternacionalizacionPK {
    componente: string;
    idioma: string;
    etiqueta: string;
}
export interface Internacionalizacion {
    id: InternacionalizacionPK;
    valor: string;
}

@Injectable(
    {
        providedIn:'root'
    }
)
export class InternacionalizacionService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PREFERENCIA, prefix: '/internacionalizacion'};
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Internacionalizacion[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    update(data: Internacionalizacion): Observable<any> {
        return this.apiService.config(this.apiConfig).put('/update', data)
            .pipe(map(res => data));
    }

}
