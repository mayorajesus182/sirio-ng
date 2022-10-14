import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
