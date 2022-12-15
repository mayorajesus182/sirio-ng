import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';

export interface ReporteGestionEfectivo {
    region: string
 }

@Injectable({
    providedIn:'root'
})
export class ReporteGestionEfectivoService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/gestion-efectivo/agencia'};
    }

    agenciaOperativa(params: ReporteGestionEfectivo): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.region}/resumen/agencia-operativa`);
    }

    
    

}
