import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface MovimientoEfectivo {
    id: string;
    nombre: string;
    fechaCreacion?: any;
}


@Injectable({
    providedIn:'root'
})
export class MovimientoEfectivoService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CONTROL_EFECTIVO, prefix: '/movimiento-efectivo'};
    }

    all(): Observable<MovimientoEfectivo[]> {
        return this.apiService.config(this.apiConfig).get('/all');
    }

    get(id: string): Observable<MovimientoEfectivo> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

}
