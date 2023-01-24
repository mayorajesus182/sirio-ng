import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface GestionEfectivoReports {
    region: string
    agencia: string
    moneda: string
    taquilla: string
    remesa: string
 }


@Injectable({
    providedIn:'root'
})
export class GestionEfectivoReportsService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_REPORT, prefix: '/gestion-efectivo'};
    }
    
    cupoAgencia(params: GestionEfectivoReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/cupo-agencia', params);
    } 
    
    agenciaOperativa(params: GestionEfectivoReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/agencia-operativa', params);
    }

    taquillaOperativa(params: GestionEfectivoReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/taquilla-operativa', params);
    } 

    cierreAgencia(params: GestionEfectivoReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/cierre-agencia', params);
    }

    cuadreAgencia(params: GestionEfectivoReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/cuadre-agencia', params);
    }

    cuadreTaquilla(params: GestionEfectivoReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/cuadre-taquilla', params);
    }

    cierreTaquilla(params: GestionEfectivoReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/reports/cierre-taquilla', params);
    }

    remesaEnviada(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/reports/remesa-enviada');
    }

    remesaRecibida(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/reports/remesa-recibida');
    }

    remesaSolicitada(): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByGet('/reports/remesa-solicitada');
    }

    cartaPorte(params: GestionEfectivoReports): Observable<any> {
        return this.apiService.config(this.apiConfig).pullFileByPost('/carta-porte', params);
    }
}
