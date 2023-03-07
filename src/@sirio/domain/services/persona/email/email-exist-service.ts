import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiConfConstants } from 'src/@sirio/constants';
import { ApiOption, ApiService } from 'src/@sirio/services/api';

export interface Email {
    exists: any;

}


@Injectable({
    providedIn:'root'
})


export class EmailExistService {

    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_PERSONA, prefix: '/email'};
    }


    get(Email: String, Persona: String): Observable<Email> {
        return this.apiService.config(this.apiConfig).get(`/${Persona}/${Email}/exists`);
    }

}
