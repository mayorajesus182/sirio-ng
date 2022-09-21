import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Municipio {
    id: string;
    nombre: string;
    codigoLocal: string;
    ciudad: string;
    pais: string;
    paisNombre: string;
    estado: string;
    estadoNombre: string;
    fechaCreacion?: any;
    activo?: number;
    
}

@Injectable({
    providedIn:'root'
})
export class MunicipioService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONFIGURACION, prefix: '/municipio'};
    }

    all(): Observable<Municipio[]> {
        return this.apiService.config(this.apiConfig).get('/all');
    }

    actives(): Observable<Municipio[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }


    activesByEstado(estado:string): Observable<Municipio[]> {
        return this.apiService.config(this.apiConfig).get(`/byestado/${estado}/actives`);
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    get(id: string): Observable<Municipio> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Municipio[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: Municipio): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Municipio): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}
