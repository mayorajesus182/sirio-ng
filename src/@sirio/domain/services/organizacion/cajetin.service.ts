import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Cajetin {
    id?: number;
    atm?: string;    
    nombre:string;
    cantidad: number;
    conoMonetario?: number;
    fechaCreacion?: any;
}

@Injectable({
    providedIn:'root'
})
export class CajetinService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_ORGANIZACION, prefix: '/cajetin'};
    }

    activesByAtm(atm: string): Observable<Cajetin[]> {
        return this.apiService.config(this.apiConfig).get(`/${atm}/byatm/actives`);
    }

    update(data: Cajetin): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }

}




