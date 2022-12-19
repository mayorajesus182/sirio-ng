import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';

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
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.region}/resumen/taquilla-operativa`);
    } 

    cierreAgencia(params: ReporteGestionEfectivoAgencia): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.agencia}/${params.moneda}/resumen/cierre-agencia`);
    }
}
