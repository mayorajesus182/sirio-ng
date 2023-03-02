import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RequisitoPersona, RequisitoPersonaService } from 'src/@sirio/domain/services/configuracion/recaudo/requisito-persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-requisito-persona-form',
    templateUrl: './requisito-persona-form.component.html',
    styleUrls: ['./requisito-persona-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class RequisitoPersonaFormComponent extends FormBaseComponent implements OnInit {

    requisitoPersona: RequisitoPersona = {} as RequisitoPersona;
    // public naturales: any[] = [];
    // public juridicos: any[] = [];
    public naturales = new BehaviorSubject<any[]>([]);
    public juridicos = new BehaviorSubject<any[]>([]);
    public requisitosUpdate: any[] = [];
    btnState: boolean = false;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private requisitoPersonaService: RequisitoPersonaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.requisitoPersonaService.all().subscribe(data => {
            // this.requisitos.next(data);

            this.naturales.next(data.filter(c => c.tipoPersona === 'N'));
            this.juridicos.next(data.filter(c => c.tipoPersona === 'J'));
        });
    }


    update() {

        this.btnState = true;
        this.requisitosUpdate = this.juridicos.value.concat(this.naturales.value);
        this.requisitoPersonaService.update(this.requisitosUpdate).subscribe(data => {
          this.btnState = false;
          this.successResponse('Los Requisitos Mínimos de la Persona', 'Actualizados', true)
        }, err => {
          this.btnState = false;
          this.errorResponse(undefined, false)
        });
    
      }

}
