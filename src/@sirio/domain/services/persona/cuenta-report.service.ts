import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface CuentaReport {
    id: number;
}

@Injectable({
    providedIn:'root'
})
export class CuentaReportService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/cuenta-banco'};
    }
  
    certificado(id: number): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${id}/certificado`);
        
    }

    send(id:number): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${id}/certificado-send`);
    }


}