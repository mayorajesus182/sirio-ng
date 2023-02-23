import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { GlobalConstants } from "src/@sirio/constants";
import { SweetAlertService } from "src/@sirio/services/swal.service";
import { Persona } from "./persona.service";


@Injectable({
    providedIn: 'root'
})
export class PersonaDataMandatoryService {

    constructor(
        private swalService: SweetAlertService,
        private router: Router
    ) { }

    validate(persona: Persona): boolean {


        /// esto sería para poder aperturar una cuenta
        // tal vez en el futuro se requiera satisfacer 
        // otros aspectos en otros casos de usos o lugares dentro de la application

        // console.log('validate persona ', persona);

        const type = persona.tipoPersona === 'PERJUR' ? 'juridica' : 'natural';
        if (persona.direcciones === 0 || persona.telefonos === 0) {

            let message = "<ul style='text-align: left'>"
            //   message = message.concat(persona.direcciones > 0 ? '<li>Registrar sus Datos Básicos</li>'.concat('') : '');
            message = message.concat(persona.direcciones == 0 ? '<li>Registrar al menos una Dirección</li>'.concat('') : '');
            message = message.concat(persona.telefonos == 0 ? '<li>Registrar al menos un Número de Teléfono</li>' : '');
            message = message.concat('</ul>');

            this.swalService.show('Antes de realizar una apertura de cuenta usted debe:', undefined, { html: message, showCancelButton: false }).then((resp) => {
                // this.router.navigate(['/sirio/persona/' + type + '/edit']);
                sessionStorage.setItem(GlobalConstants.PREV_PAGE, this.router.url);
                this.router.navigate([`/sirio/persona/${type}/${persona.tipoDocumento}/${persona.identificacion}/edit`]);
                
            });

            return false;
        }

        return true;
    }

}