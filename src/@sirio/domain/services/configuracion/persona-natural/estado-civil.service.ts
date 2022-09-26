import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface EstadoCivil {
    id: string;
    nombre: string;
    codigoLocal: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class EstadoCivilService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONFIGURACION, prefix: '/persona-natural/estado-civil'};
    }

    all(): Observable<EstadoCivil[]> {
        return this.apiService.config(this.apiConfig).get('/all');
    }

    actives(): Observable<EstadoCivil[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    get(id: string): Observable<EstadoCivil> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<EstadoCivil> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<EstadoCivil[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: EstadoCivil): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: EstadoCivil): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}
