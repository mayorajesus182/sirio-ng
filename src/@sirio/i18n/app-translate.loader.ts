import { TranslateLoader } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { ApiConfConstants } from "../constants";
import { ApiOption, ApiService } from "../services/api";

export class AppTranslateLoader implements TranslateLoader {
  private apiConfig: ApiOption;
  constructor(private apiService: ApiService) {
    this.apiConfig = { name: ApiConfConstants.API_DEFAULT, prefix: '/public/assets/i18n' };
  }

  getTranslation(lang: string): Observable<any> {
    console.log(' set current  lang: ' + lang);

    // const url = `${environment.api.resource}/assets/i18n/${lang}.json`;

    return this.apiService.config(this.apiConfig).get(`/${lang}.json`).pipe(catchError((_) => this.apiService.config(this.apiConfig).get(`/es.json`)));
  }
} 