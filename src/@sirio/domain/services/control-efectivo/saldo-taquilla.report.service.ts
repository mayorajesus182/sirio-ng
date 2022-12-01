import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


@Injectable({
    providedIn:'root'
})
export class SaldoTaquillaReportService {
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/gestion-efectivo/taquilla'};
    }


    reportResumen(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen');
    }

    reportResumenEfectivo(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen/efectivo');
    }
}
