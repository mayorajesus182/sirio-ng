import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
export interface Agencia {
    id: string;
    nombre: string;
    zona: string;
    region: string;
    estado: string;
    municipio: string;
    parroquia: string;
    zonaPostal: string;
    direccion: string;
    email: string;
    telefono: number;
    telefonoAlt: number;
    latitud: number;
    longitud: number;
    fechaCreacion?: any;
    activo?: number;
    institucion: string;
    horarioExt: number;
    taquillas: number;
    taquillasOperativas: number;
    atm: number;
    atmOperativos: number;
}

@Injectable({
    providedIn:'root'
})
export class AgenciaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_ORGANIZACION, prefix: '/agencia'};
    }

    actives(): Observable<Agencia[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    exists(codigo: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${codigo}/exists`);
    }

    get(id: string): Observable<Agencia> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    getWithUsuario(): Observable<Agencia> {
        return this.apiService.config(this.apiConfig).get(`/withusuario/get`);
    }

    detail(id: string): Observable<Agencia> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Agencia[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    save(data: Agencia): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: Agencia): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

    close(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/close`);
    }

    findActivesByRegion(region: string): Observable<Agencia[]> {
        return this.apiService.config(this.apiConfig).get(`/${region}/byregion/actives`);
    }

}
