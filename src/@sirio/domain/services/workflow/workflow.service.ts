import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';

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
    public notify = new BehaviorSubject<boolean>(false);
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_WORKFLOW, prefix: '/task'};
    }

    list(): Observable<Workflow[]> {
        return this.apiService.config(this.apiConfig).get('/list');
    }

    assigned(): Observable<Workflow[]> {
        return this.apiService.config(this.apiConfig).get('/assigned');
    }

    existsAnyOpen(): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/anyopen/exists`);
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

    rollback(data: any): Observable<any> { 
        return this.apiService.config(this.apiConfig).put('/rollback', data);
    }

    annulled(data: any): Observable<any> { 
        return this.apiService.config(this.apiConfig).put('/annulled', data);
    }

    checkView(id: any): Observable<any> {
        return this.apiService.config(this.apiConfig).get(`/${id}/check/view`);
    }

}
