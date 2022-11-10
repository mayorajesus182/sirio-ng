import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { map } from 'rxjs/operators';
import { ConoMonetario } from '../configuracion/divisa/cono-monetario.service';

export interface SaldoTaquilla {
    id: number;
    taquilla: number;
    taquillaNombre?: string;
    taquillaUsuario?: string;
    fecha: any;
    ingreso: number;  
    egreso: number;
    transito: number;
    saldo: number;
    declarado: number;
    ajuste: number;
    diferencia: number;
    moneda: string;
    nombreMoneda?: string;
    siglasMoneda?: string;
    cerrado: any;
    detalleEfectivo: ConoMonetario[];
}

@Injectable({
    providedIn:'root'
})
export class SaldoTaquillaService {
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/saldo-taquilla'};
    }

    getSaldoByMoneda(moneda: string): Observable<number> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/bymoneda/saldo`);
    }

    getSaldoByMonedaAndTaquilla(moneda: string, taquilla: number): Observable<number> {
        return this.apiService.config(this.apiConfig).get(`/${moneda}/moneda/${taquilla}/taquilla/saldo`);
    }

    allByTaquilla(taquilla: number): Observable<SaldoTaquilla[]> {
        return this.apiService.config(this.apiConfig).get(`/${taquilla}/taquilla/list`);
    }

    allByAgencia(): Observable<SaldoTaquilla[]> {
        return this.apiService.config(this.apiConfig).get(`/byagencia/list`);
    }

    allWithMovements(): Observable<SaldoTaquilla[]> {
        return this.apiService.config(this.apiConfig).get(`/conmovimiento/list`);
    }

    all(): Observable<SaldoTaquilla[]> {
        return this.apiService.config(this.apiConfig).get(`/list`);
    }
    
    update(data: SaldoTaquilla): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

}
