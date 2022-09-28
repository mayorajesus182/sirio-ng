import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiOption, ApiService } from 'src/@sirio/services/api';
import { ApiConfConstants } from 'src/@sirio/constants';


export interface Institucion {
    id: string;
    identificacion: string;
    siglas: string;
    nombre: string;
    estado: string;
    municipio: string;
    parroquia: string;
    zonaPostal: number;
    direccion: string; 
    email:string;
    web:string;
    telefono:string;
    telefono_alt:string ;     
    latitud:string;
    longitud:string;
    activo?: number;
}

@Injectable({
    providedIn:'root'
})
export class InstitucionService {
    searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService
    ) {
        this.apiConfig = {name: ApiConfConstants.API_ORGANIZACION, prefix: '/institucion'};
    }



    get(): Observable<Institucion> {
        return this.apiService.config(this.apiConfig).get('/get');
    }

    
 
   
    update(data: Institucion): Observable<any> {
        return this.apiService.config(this.apiConfig).put(`/${data.id}/update`, data)
            .pipe(map(res => data));
    }
    

  
}
