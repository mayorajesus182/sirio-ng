import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface ViajeTransporte {
    viaje: string;
    nombre: string;
    transportista:string;
    costo: number;
    costoDivisa: number;
    fechaCreacion?: any;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class ViajeTransporteService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_TRANSPORTE, prefix: '/viaje-transporte'};
    }

    activesByTransportista(transportista: string): Observable<ViajeTransporte[]> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/bytransportista/actives`);
    }

    update(data: ViajeTransporte): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.viaje}/${data.transportista}/update`, data)
            .pipe(map(res => data));
    }

}




