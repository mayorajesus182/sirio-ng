import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-wf-chequear-persona-natural-form',
    templateUrl: './wf-chequear-persona-natural-form.component.html',
    styleUrls: ['./wf-chequear-persona-natural-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class WFChequearPersonaNaturalFormComponent extends FormBaseComponent implements OnInit {


    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private personaService: PersonaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }


    ngOnInit() {

        this.route.paramMap.subscribe(params => {

            let exp = params.get('exp');
            this.loadingDataForm.next(true);

            if (exp) {

                // this.personaService.getByExpediente(exp).subscribe(data => {
               
                // });

            }
        });

    }
  
    save() {

    }
}
