import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface ReferenciaBancaria {
    id: number;
    persona: string,
    entidadFinanciera: string,
    tipoProducto: string,
    numeroCuenta: string,
    cifraPromedio: string
}


@Injectable({
    providedIn: 'root'
})
export class ReferenciaBancariaService {

    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = { name: ApiConfConstants.API_PERSONA, prefix: '/referencia-bancaria' };
    }

    allByPersonaId(id: number): Observable<ReferenciaBancaria[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }


    get(id: number): Observable<ReferenciaBancaria> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<ReferenciaBancaria> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: ReferenciaBancaria): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: ReferenciaBancaria): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    delete(id: number): Observable<ReferenciaBancaria> {
        return this.apiService.config(this.apiConfig).put(`/${id}/delete`);
    }


}

