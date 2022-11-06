import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';

export interface Rol {
    id: string;
    nombre: string;
}

@Injectable({
    providedIn:'root'
})
export class RolService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    public notify = new BehaviorSubject<boolean>(false);
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_WORKFLOW, prefix: '/rol'};
    }

    getByWorkflow(workflow: string): Observable<Rol> {
        return this.apiService.config(this.apiConfig).get(`/${workflow}/byworkflow/get`);
    }

}
