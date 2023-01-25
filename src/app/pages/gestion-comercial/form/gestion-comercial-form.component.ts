import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-gestion-comercial-form',
    templateUrl: './gestion-comercial-form.component.html',
    styleUrls: ['./gestion-comercial-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class GestionComercialFormComponent extends FormBaseComponent implements OnInit {

    public persona: Persona = {} as Persona;
    public showServicios = false;
    public showProductos = false;
    public showCreditos = false;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.loadingDataForm.next(true);
    }

    ngAfterViewInit(): void {
    }

    openServicios(opened: boolean) {
        this.showServicios = opened;
        this.cdr.detectChanges();
    }

    openCreditos(opened: boolean) {
        this.showCreditos = opened;
        this.cdr.detectChanges();
    }

    openProductos(opened: boolean) {
        this.showProductos = opened;
        this.cdr.detectChanges();
    }


    queryResult(event) {

        if (!event.id && !event.numper) {
            this.loaded$.next(false);
            this.persona = {} as Persona;
            this.cdr.detectChanges();
        } else {
            this.persona = event;
            this.loaded$.next(true);
        }
    }

}
