import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface SolicitudRemesa {
    id: number;
    emisor: string;
    nombreEmisor: string;
    receptor: string;
    nombreReceptor: string;
    viaje: string;
    nombreViaje: string;
    montoSolicitado: number;
    montoEnviado: number;
    montoRecibido: number;
    moneda: string;
    nombreMoneda: string;
    fechaSolicitud: any;   
    fechaEnvio: any;
    fechaRecibo: any;
    estatusSolicitud: string;
    nombreEstatusSolicitud: string;
}

@Injectable({
    providedIn:'root'
})
export class SolicitudRemesaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/solicitud-remesa'};
    }

    get(id: number): Observable<SolicitudRemesa> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    getByExpediente(expediente: string): Observable<SolicitudRemesa> {
        return this.apiService.config(this.apiConfig).get(`/${expediente}/byexpediente/get`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<SolicitudRemesa[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    detail(id: string): Observable<SolicitudRemesa> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    detailByExpediente(expediente: string): Observable<SolicitudRemesa> {
        return this.apiService.config(this.apiConfig).get(`/${expediente}/byexpediente/detail`);
    }

    save(data: SolicitudRemesa): Observable<any> {
        
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: SolicitudRemesa): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

}
