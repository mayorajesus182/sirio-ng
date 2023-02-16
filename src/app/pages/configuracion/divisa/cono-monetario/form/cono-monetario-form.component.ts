import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';


@Component({
    selector: 'app-cono-monetario-form',
    templateUrl: './cono-monetario-form.component.html',
    styleUrls: ['./cono-monetario-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ConoMonetarioFormComponent extends FormBaseComponent implements OnInit {

    conomonetario: ConoMonetario = {} as ConoMonetario;
    monedas =  new BehaviorSubject<Moneda[]>([]); 

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private conomonetarioService: ConoMonetarioService,
        private monedaService: MonedaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.conomonetarioService.get(id).subscribe((conm: ConoMonetario) => {
                this.conomonetario = conm;
                this.buildForm(this.conomonetario);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.conomonetario);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && value && value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

        this.monedaService.fisicaActives().subscribe(data => {
            this.monedas.next(data);
        });
    }

    buildForm(conomonetario: ConoMonetario) {
        this.itemForm = this.fb.group({
            id: new FormControl(conomonetario.id),
            moneda: new FormControl(conomonetario.moneda || '', [Validators.required]),
            denominacion : new FormControl(conomonetario.denominacion || '', [Validators.required ]),
            esBillete: new FormControl(conomonetario.esBillete || true),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.conomonetario);
        this.conomonetario.esBillete = this.conomonetario.esBillete ? 1 : 0;
        this.saveOrUpdate(this.conomonetarioService, this.conomonetario, 'La  Moneda', this.isNew);
       
       
    }

    private codigoExists(id) {
        this.conomonetarioService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.conomonetario.id) {
            this.applyChangeStatus(this.conomonetarioService, this.conomonetario, this.conomonetario.moneda, this.cdr);
        }
    }

}
