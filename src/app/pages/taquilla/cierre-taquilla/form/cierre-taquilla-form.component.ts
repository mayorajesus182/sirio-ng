import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Tenencia, TenenciaService } from 'src/@sirio/domain/services/configuracion/domicilio/tenencia.service';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { ActividadEconomica, ActividadEconomicaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-economica.service';
import { ActividadEspecifica, ActividadEspecificaService } from 'src/@sirio/domain/services/configuracion/persona-juridica/actividad-especifica.service';
import { CategoriaEspecial, CategoriaEspecialService } from 'src/@sirio/domain/services/configuracion/persona-juridica/categoria-especial.service';
import { EstadoCivil, EstadoCivilService } from 'src/@sirio/domain/services/configuracion/persona-natural/estado-civil.service';
import { Genero, GeneroService } from 'src/@sirio/domain/services/configuracion/persona-natural/genero.service';
import { Profesion, ProfesionService } from 'src/@sirio/domain/services/configuracion/persona-natural/profesion.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { SaldoTaquilla, SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { Direccion } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { PersonaNatural, PersonaNaturalService } from 'src/@sirio/domain/services/persona/persona-natural.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-cierre-taquilla-form',
    templateUrl: './cierre-taquilla-form.component.html',
    styleUrls: ['./cierre-taquilla-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CierreTaquillaFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    saldos = new BehaviorSubject<SaldoTaquilla[]>([]);

    public direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router,
        private saldoTaquillaService: SaldoTaquillaService,
        private cdr: ChangeDetectorRef) {
        super(dialog, injector);
    }


    ngAfterViewInit(): void {
    }

    ngOnInit() {
        this.loadingDataForm.next(false);

        this.saldoTaquillaService.all().subscribe(data => {
            // this.saldos.next(data);
           // console.log('aquiiiiiiiiiiiiiii  ', data);
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;
    }


}
