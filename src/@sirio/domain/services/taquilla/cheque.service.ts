import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface ChequeSerial {
   
    serial: string;
    numeroCuenta: string;
}


@Injectable({
    providedIn:'root'
})
export class ChequeService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_TAQUILLA, prefix: '/deposito'};
    
    }

    exists(serial: string, numeroCuenta: string): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${serial}/${numeroCuenta}/exists`);
    }
   
}
