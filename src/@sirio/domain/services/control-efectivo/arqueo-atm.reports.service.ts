import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';



@Injectable({
    providedIn:'root'
})
export class ArqueoAtmReportService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/arqueo-atm'};
    }
    
    reporte(params: any): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/generar', params);
    }
}
