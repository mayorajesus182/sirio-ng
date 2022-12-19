import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';

export interface ReporteGestionEfectivoTaquilla {
    moneda: string
    taquilla: string
 }

@Injectable({
    providedIn:'root'
})
export class ReporteGestionEfectivoTaquillaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/gestion-efectivo/taquilla'};
    }

    cierreTaquilla(params: ReporteGestionEfectivoTaquilla): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.taquilla}/${params.moneda}/resumen/cierre-taquilla`);
    }

    cuadreTaquilla(params: ReporteGestionEfectivoTaquilla): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet(`/${params.taquilla}/resumen/cuadre-taquilla`);
    }
    
    

}
