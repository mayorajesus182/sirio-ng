import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Secuencia {
    id: string;
    nombre: string;
    fechaCreacion?: any;

}

export interface SecuenciaRol {
    id:any;
    secuencia: string;
    rol: string;
}

export interface Workflow {
    id: number;
    fecha?: number;
    fechaCreacion?: any;
    expediente: string;
    secuencia: string;
    rol: string;
    creadoPor: string;
    asignadoA: string;
    visto?: boolean;
    abierto?: boolean;
    devuelto?: boolean;
    initialFlow?: boolean;
    finalFlow?: boolean;
    observacion: string;
}

@Injectable({
    providedIn:'root'
})
export class WorkflowService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_WORKFLOW, prefix: ''};
    }

    list(): Observable<Workflow[]> {
        return this.apiService.config(this.apiConfig).get('/list');
    }

    assignedList(): Observable<Workflow[]> {
        return this.apiService.config(this.apiConfig).get('/assigned/list');
    }

    listByExpediente(expediente: any): Observable<Workflow[]> {
        return this.apiService.config(this.apiConfig).get(`/expediente/${expediente}/list`);
    }

    pendingQuantity(): Observable<number> {
        return this.apiService.config(this.apiConfig).get('/pending/quantity');
    }

    page(filter = '', sortPropertie = 'codigo', sortOrder = 'asc', pageNumber = 0, pageSize = 15): Observable<Workflow[]> {
        return this.apiService.config(this.apiConfig).page('/page', filter, pageNumber, pageSize, sortPropertie, sortOrder);
    }

    get(id: string): Observable<Workflow> {
        return this.apiService.config(this.apiConfig).get(`/${id}/get`);
    }

    own(id: string): Observable<Workflow> {
        return this.apiService.config(this.apiConfig).get(`/${id}/own`);
    }

    approved(data: any): Observable<any> {
        return this.apiService.config(this.apiConfig).put('/approved', data);
    }

    reject(data: any): Observable<any> {
        return this.apiService.config(this.apiConfig).put('/reject', data);
    }

    // checkView(id: any): Observable<any> {
    //     const params = new HttpParams().set('id', id);
    //     return this.apiService.config(this.apiConfig).get('/check/view', params);
    // }


    // seed(secuencia: any, objeto: any): Observable<any> {
    //     const params = new HttpParams().set('secuencia', secuencia)
    //     .set('objeto', objeto);
    //     return this.apiService.config(this.apiConfig).put('/seed', params);
    // }
}
