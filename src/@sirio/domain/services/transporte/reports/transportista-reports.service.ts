import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface TransportistaReports {
   transportista: string
}

@Injectable({
    providedIn:'root'
})
export class TransportistaReportsService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/transportista'};
    }

    empleadoTransportista(params: TransportistaReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/empleado-transportista', params);
    }

    empresaTransportista(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/reports/empresa');
    }

    costoAvaluoTransportista(params: TransportistaReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/costos-avaluo', params);
    }

    costoMaterialTransportista(params: TransportistaReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/costos-material', params);
    }

    costoViajeTransportista(params: TransportistaReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/costos-viaje', params);
    }

    avaluoTransportista(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/reports/avaluo');
    }

    materialTransportista(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/reports/material');
    }

    viajeTransportista(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/reports/viaje');
    }

}
