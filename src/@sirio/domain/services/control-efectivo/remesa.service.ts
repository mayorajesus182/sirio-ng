import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface CompraRemesa {
    moneda: string;
    monto: number;
    detalleEfectivo: any[];
}

export interface MaterialRemesa {
    material: string;
    nombre: string;
    cantidad: number;
    costo: number;
}


export interface Remesa {
    id: string;
    emisor: string;
    nombreEmisor: string;
    receptor: string;
    nombreReceptor: string;
    transportista: string;
    nombreTransportista: string;
    viaje: string;
    nombreViaje: string;
    montoSolicitado: number;
    montoEnviado: number;
    montoRecibido: number;
    moneda: string;
    cajasBolsas: string;
    plomos: string;
    nombreMoneda: string;
    fechaSolicitud: any;
    fechaEnvio: any;
    fechaRecibo: any;
    estatusSolicitud: string;
    nombreEstatusSolicitud: string;
    esAgencia: number;
    materiales: any[];
    detalleEfectivo: any[];
    responsables: string[];
    detalleEfectivoEnviado: any[];
    detalleEfectivoRecibido: any[];
}

@Injectable({
    providedIn: 'root'
})
export class RemesaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/remesa' };
    }

    get(id: number): Observable<Remesa> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Remesa[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    pageSolicitudes(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Remesa[]> {
        return this.apiService.config(this.apiConfig).page('/solicitudes/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    pagePorProcesar(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Remesa[]> {
        return this.apiService.config(this.apiConfig).page('/porprocesar/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    pagePorDespachar(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Remesa[]> {
        return this.apiService.config(this.apiConfig).page('/pordespachar/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    pagePorRecibir(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Remesa[]> {
        return this.apiService.config(this.apiConfig).page('/porrecibir/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    pagePorAprobar(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Remesa[]> {
        return this.apiService.config(this.apiConfig).page('/poraprobar/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    detail(id: string): Observable<Remesa> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }

    receive(data: Remesa): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/receive/update`, data)
            .pipe(map(res => data));
    }

    save(data: Remesa): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    ingresoCompraCreate(data: CompraRemesa): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/ingreso/comprabcv/create`, data)
            .pipe(map(res => data));
    }

    dispatch(data: Remesa): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/dispatch/update`, data)
            .pipe(map(res => data));
    }

    annular(data: Remesa): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/override`, data)
            .pipe(map(res => data));
    }

    approve(id: string): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${id}/approve/update`)
            .pipe(map(res => id));
    }

    processCreate(data: Remesa): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/process/create`, data)
            .pipe(map(res => data));
    }

    processUpdate(data: Remesa): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/process/update`, data)
            .pipe(map(res => data));
    }

    sendCreate(data: Remesa): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/envio/create', data)
            .pipe(map(res => data));
    }

    sendUpdate(data: Remesa): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/envio/update`, data)
            .pipe(map(res => data));
    }

}
