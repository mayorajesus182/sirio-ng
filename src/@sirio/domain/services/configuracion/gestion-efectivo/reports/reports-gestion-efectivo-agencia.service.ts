import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface ReporteGestionEfectivoAgencia {
    region: string
    agencia: string
    moneda: string
 }


@Injectable({
    providedIn:'root'
})
export class ReporteGestionEfectivoAgenciaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/gestion-efectivo/agencia'};
    }

    agenciaOperativa(params: ReporteGestionEfectivoAgencia): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.region}/resumen/agencia-operativa`);
    }

    cupoAgencia(params: ReporteGestionEfectivoAgencia): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.agencia}/${params.region}/resumen/cupo-agencia`);
    }

    taquillaOperativa(params: ReporteGestionEfectivoAgencia): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/resumen/taquilla-operativa', params);
    } 

    cierreAgencia(params: ReporteGestionEfectivoAgencia): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.agencia}/${params.moneda}/resumen/cierre-agencia`);
    }
}
