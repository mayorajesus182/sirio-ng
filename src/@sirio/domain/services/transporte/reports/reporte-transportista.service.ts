import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface ReporteTransportista {
   transportista: string
}

@Injectable({
    providedIn:'root'
})
export class ReporteTransportistaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/transportista'};
    }

    empleadoTransportista(params: ReporteTransportista): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.transportista}/resumen/empleado-transportista`);
    }

    empresaTransportista(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen/empresa');
    }

    costoAvaluoTransportista(params: ReporteTransportista): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.transportista}/resumen/costos-avaluo`);
    }

    costoMaterialTransportista(params: ReporteTransportista): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.transportista}/resumen/costos-material`);
    }

    costoViajeTransportista(params: ReporteTransportista): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.transportista}/resumen/costos-viaje`);
    }

    avaluoTransportista(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen/avaluo');
    }

    materialTransportista(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen/material');
    }

    viajeTransportista(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen/viaje');
    }

}
