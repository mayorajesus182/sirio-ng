import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ApiConfConstants, GlobalConstants } from "src/@sirio/constants";
import { ApiOption, ApiService } from "src/@sirio/services/api";
import { SweetAlertService } from "src/@sirio/services/swal.service";
import { Persona } from "./persona.service";


@Injectable({
    providedIn: 'root'
})
export class PersonaDataMandatoryService {

    private apiConfig: ApiOption;
    constructor(
        private apiService: ApiService,
        private swalService: SweetAlertService,
        private router: Router
    ) {
        this.apiConfig = { name: ApiConfConstants.API_PERSONA, prefix: '' };
    }


    validate(persona: number): Observable<string[]> {
        return this.apiService.config(this.apiConfig).get(`/${persona}/validate-data/required`);
    }


    showErrorsAndRedirect(errors: string[], persona:Persona): void {

        if (errors.length > 0) {
            console.log('PERSONA ', persona);
            
            const type = persona.tipoPersona === GlobalConstants.PERSONA_JURIDICA ? 'juridica' : 'natural';


            this.swalService.show('Para continuar usted debe:', undefined, { html: this.errorsToHtml(errors), showCancelButton: false }).then((resp) => {
                
                if(!this.router.url.includes('/sirio/persona/natural') && !this.router.url.includes('/sirio/persona/juridica')){
                    sessionStorage.setItem(GlobalConstants.PREV_PAGE, this.router.url);

                    this.router.navigate([`/sirio/persona/${type}/${persona.tipoDocumento}/${persona.identificacion}/edit`]);
                }

            });
        }

    }

    errorsToHtml(errors:string[]){
        let message = "<ul style='text-align: left'>";
        message+= errors.map(e => `<li>${e}</li>`).reduce((a, b) => a.concat(b)).concat("</ul>");
        return message;
    }

}