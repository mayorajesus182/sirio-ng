import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface EmpleadoTransporte {
    id: string;
    transportista:string;
    tipoDocumento: string;
    identificacion: string;
    nombre: string;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class EmpleadoTransporteService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_TRANSPORTE, prefix: '/empleado'};
    }

    allEmpleados(): Observable<EmpleadoTransporte[]> {
        return this.apiService.config(this.apiConfig).get(`/empleados/all`);
    }

    allByTransportista(transportista: string): Observable<EmpleadoTransporte[]> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/bytransportista/all`);
    }

    exists(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/exists`);
    }

    existsByTranportistaAndIdentificacion(transportista: string, identificacion: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/${identificacion}/exists`);
    }

    get(id: string): Observable<EmpleadoTransporte> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    save(data: EmpleadoTransporte): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: EmpleadoTransporte): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    changeStatus(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/status/update`);
    }

}
