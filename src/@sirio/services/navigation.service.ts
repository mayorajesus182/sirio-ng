import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiConfConstants } from "../constants";
import { ApiOption, ApiService } from "./api";


export interface MenuItem {
  label: string,      // Used as display text for item and title for separator type
  view?: string,     // Router state
  icon?: string,      // Material icon name
  color?: string,      // Material color
  type?: string,      // Material icon name
  tooltip?: string,   // Tooltip text 
  functionName?:string,
  section?:string,
  showInactive?:boolean;
  subpermisos?: MenuItem[];// Dropdown items
}

@Injectable(
  {
    providedIn: 'root',
  }
)
export class NavigationService {
  private apiConfig: ApiOption;
  constructor (
    private apiService: ApiService
  ) {
    this.apiConfig= {name:ApiConfConstants.API_DEFAULT, prefix:'/session'};
  }


  get(): Observable<MenuItem[]> {
    return this.apiService.config(this.apiConfig).get('/permissions');
  }
  

  getActions(url): Observable<MenuItem[]> {
    
    let params = new HttpParams().set('view', url);
    // se piden las actions para la ruta actual
    return this.apiService.config(this.apiConfig).get('/permission/actions',params);
  }

  getButtons(url): Observable<MenuItem[]> {
    
    let params = new HttpParams().set('view', url);
    // se piden los botones para la ruta actual
    return this.apiService.config(this.apiConfig).get('/permission/buttons',params);
  }

}