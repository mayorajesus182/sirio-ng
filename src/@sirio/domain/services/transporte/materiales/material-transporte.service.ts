import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';
import { Material } from '../material.service';


export interface MaterialTransporte {
    material: string;
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
export class MaterialTransporteService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_TRANSPORTE, prefix: '/material-transporte'};
    }

    activesByTransportista(transportista: string): Observable<MaterialTransporte[]> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/bytransportista/actives`);
    }

    allWithCostoByTransportista(transportista: string): Observable<Material[]> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/withcosto/bytransportista/list`);
    }

    allWithCostoDivisaByTransportista(transportista: string): Observable<Material[]> {
        return this.apiService.config(this.apiConfig).get(`/${transportista}/withcostodivisa/bytransportista/list`);
    }

    allWithCosto(): Observable<Material[]> {
        return this.apiService.config(this.apiConfig).get(`/withcosto/bytransportista/list`);
    }

    allWithCostoDivisa(): Observable<Material[]> {
        return this.apiService.config(this.apiConfig).get(`/withcostodivisa/bytransportista/list`);
    }

    update(data: MaterialTransporte[]): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/update`, data)
            .pipe(map(res => data));
    }

    // update(data: MaterialTransporte): Observable<any> {
    //     return this.apiService.config(this.apiConfig).put(`/${data.material}/${data.transportista}/update`, data)
    //         .pipe(map(res => data));
    // }

}




