import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface SaldoAgenciaReports {
    agencia: string
 }


@Injectable({
    providedIn:'root'
})
export class SaldoPrincipalReportService {
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/gestion-efectivo/principal'};
    }

    reportResumen(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen');
    } 

    
    // reportResumenEfectivo(): Observable<any> {
    //     return this.apiService.config(this.apiConfig).pullFileByGet('/resumen/efectivo');
    // }
    

}

