import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


@Injectable({
    providedIn:'root'
})
export class SaldoAgenciaReportService {
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/gestion-efectivo/agencia'};
    }


    reportResumen(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen');
    }
    reportResumenByAgencia(agencia:string): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${agencia}/resumen`);
    }

    reportResumenEfectivo(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/resumen/efectivo');
    }

    reportResumenEfectivoByAgencia(agencia:string): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${agencia}/resumen/efectivo`);
    }
}
