import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';
import { Viaje } from '../viaje.service';


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

    allWithCostoByTransportista(transportista: string): Observable<Viaje[]> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/withcosto/bytransportista/list`);
    }

    allWithCostoDivisaByTransportista(transportista: string): Observable<Viaje[]> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/withcostodivisa/bytransportista/list`);
    }

    allWithCosto(): Observable<Viaje[]> {
        return this.apiService.config(this.apiConfig).get(`/withcosto/bytransportista/list`);
    }

    allWithCostoDivisa(): Observable<Viaje[]> {
        return this.apiService.config(this.apiConfig).get(`/withcostodivisa/bytransportista/list`);
    }
    
    update(data: ViajeTransporte[]): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/update`, data)
            .pipe(map(res => data));
    }

    // update(data: ViajeTransporte): Observable<any> {
    //     return this.apiService.config(this.apiConfig).put(`/${data.viaje}/${data.transportista}/update`, data)
    //         .pipe(map(res => data));
    // }

}




