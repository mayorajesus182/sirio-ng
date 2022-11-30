import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface EmpresaRelacionada {
    id: string;
   
    persona: string;

    relacionEmpresa?: string;

    empresa: string;
    
    direccion: string;
}


@Injectable({
    providedIn:'root'
})
export class EmpresaRelacionadaService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/empresa-relacionada'};
    }

    allByPersonaId(id:number): Observable<EmpresaRelacionada[]> {
        return this.apiService.config(this.apiConfig).get(`/${id}/all`);
    }

    actives(): Observable<EmpresaRelacionada[]> {
        return this.apiService.config(this.apiConfig).get('/actives');
    }

    get(id: number): Observable<EmpresaRelacionada> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    detail(id: string): Observable<EmpresaRelacionada> {
        return this.apiService.config(this.apiConfig).get(`/${id}/detail`);
    }


    save(data: EmpresaRelacionada): Observable<any> {
        return this.apiService.config(this.apiConfig).post('/create', data)
            .pipe(map(res => data));
    }

    update(data: EmpresaRelacionada): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

    delete(id: number): Observable<EmpresaRelacionada> {
        return this.apiService.config(this.apiConfig).put(`/${id}/delete`);
    }

}