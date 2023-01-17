import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface SaldoAcopioReports {
    agencia: string
 }


@Injectable({
    providedIn:'root'
})
export class SaldoAcopioReportService {
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/gestion-efectivo/acopio'};
    }

    reportResumen(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen');
    } 

    
    reportResumenEfectivo(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen/efectivo');
    }

    reportResumenByAcopioId(params: SaldoAcopioReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/resumen', params);
    }

    reportResumenEfectivoByAcopioId(params: SaldoAcopioReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/resumen/efectivo', params);
    }
    

}

