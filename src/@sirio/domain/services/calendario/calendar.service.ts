import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';


export interface Today {
    today: string;
    todayLong: string;
}

@Injectable({
    providedIn:'root'
})
export class CalendarioService {
    
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_CALENDAR, prefix: ''};
    }
 

    today(): Observable<Today> {
        return this.apiService.config(this.apiConfig).get('/today');
    }


}
