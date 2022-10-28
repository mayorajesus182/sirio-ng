import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface DetalleArqueo {
    id: number;
    arqueo: number;
    cajetin: number;
    anterior: number;
    dispensado: number;
    rechazado: number;
    fisico: number;
    sobrante: number;
    faltante: number;
    incremento: number;
    retiro: number;
    actual: number;
    descripcion?: string;
    denominacion?: number;
    monto?: number;
}

export interface ArqueoAtm {
    id: number;
    atm?: string;
    tipoArqueo?: string;
    fecha?: any;
    secuencia: number;
    monto?: number;
    fechaCreacion?: any;
    utimoArqueo?: any;
    detalles: DetalleArqueo[];
}


@Injectable({
    providedIn: 'root'
})
export class ArqueoAtmService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/arqueo-atm' };
    }

    getTop(atm: string): Observable<ArqueoAtm> {
        return this.apiService.config(this.apiConfig).get(`/${atm}/toparqueo/get`);
    }

    save(data: ArqueoAtm): Observable<any> {

        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

}
