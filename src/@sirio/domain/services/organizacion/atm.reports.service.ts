import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';



@Injectable({
    providedIn:'root'
})
export class AtmReportService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/atm'};
    }
    
    reporte(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/generar');
    }
}
