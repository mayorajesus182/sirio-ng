import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { BovedaAgencia, BovedaAgenciaService } from 'src/@sirio/domain/services/control-efectivo/boveda-agencia.service';
import { MovimientoEfectivo, MovimientoEfectivoService } from 'src/@sirio/domain/services/control-efectivo/movimiento-efectivo.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-pase-efectivo-form',
    templateUrl: './pase-efectivo-form.component.html',
    styleUrls: ['./pase-efectivo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaseEfectivoFormComponent extends FormBaseComponent implements OnInit {

    bovedaAgencia: BovedaAgencia = {} as BovedaAgencia;
    public movimientos = new BehaviorSubject<MovimientoEfectivo[]>([]);

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private bovedaAgenciaService: BovedaAgenciaService,
        private movimientoEfectivoService: MovimientoEfectivoService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.bovedaAgenciaService.get(id).subscribe((agn: BovedaAgencia) => {
                this.bovedaAgencia = agn;
                this.buildForm(this.bovedaAgencia);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.bovedaAgencia);
            this.loadingDataForm.next(false);
        }

        this.movimientoEfectivoService.all().subscribe(data => {
            this.movimientos.next(data);
        });

        // if(!id){
        //     this.f.id.valueChanges.subscribe(value => {
        //         if (!this.f.id.errors && this.f.id.value.length > 0) {
        //             this.codigoExists(value);
        //         }
        //     });
        // }
    }

    buildForm(bovedaAgencia: BovedaAgencia) {
        this.itemForm = this.fb.group({
            taquilla: new FormControl(bovedaAgencia.taquilla || undefined),
            usuarioTaquilla: new FormControl(bovedaAgencia.usuarioTaquilla || undefined),
            movimientoEfectivo: new FormControl(bovedaAgencia.movimientoEfectivo || undefined, Validators.required),
            monto: new FormControl(bovedaAgencia.monto || undefined, Validators.required),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.bovedaAgencia);
        this.saveOrUpdate(this.bovedaAgenciaService, this.bovedaAgencia, 'El Pase de Efectivo', this.isNew);
    }

    // private codigoExists(id) {
    //     this.bovedaAgenciaService.exists(id).subscribe(data => {
    //         if (data.exists) {
    //             this.itemForm.controls['id'].setErrors({
    //                 exists: true
    //             });
    //             this.cdr.detectChanges();
    //         }
    //     });
    // }

}
