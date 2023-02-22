import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface PersonaReport {
    id: number
 }
@Injectable({
    providedIn: 'root'
})


export class PersonaReportService {

    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_REPORT, prefix: '/persona' };
    }

    ficha(id: number): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${id}/ficha`);
    }

   
}

