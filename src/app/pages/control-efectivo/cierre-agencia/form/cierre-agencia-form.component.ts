import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { SaldoAgencia, SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-cierre-agencia-form',
    templateUrl: './cierre-agencia-form.component.html',
    styleUrls: ['./cierre-agencia-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CierreAgenciaFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    saldos = new BehaviorSubject<SaldoAgencia[]>([]);
    agencia: Agencia = {} as Agencia;
    diferencia: number = 0

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router,
        private saldoAgenciaService: SaldoAgenciaService,
        private taquillaService: TaquillaService,
        private agenciaService: AgenciaService,
        private workflowService: WorkflowService,
        private cdr: ChangeDetectorRef) {
        super(dialog, injector);
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {


        this.agenciaService.getWithUsuario().subscribe(data => {
            this.agencia = data;
        });

        this.saldoAgenciaService.allWithMovements().subscribe(data => {
            this.saldos.next(data);
        });
    }

    closeDay() {

        let mensaje = '';

        // Se verifica 
        this.workflowService.existsAnyOpen().subscribe(wfOpen => {

            if (wfOpen) {

                mensaje = 'Cierre Sus Tareas Pendientes Y Verifique Que No Existan Pases En Transito Pendientes Por Aprobación';
                this.swalService.show('No se Puede Efectuar el Cierre', undefined, { html: mensaje, showCancelButton: false }).then((resp) => {
                    if (!resp.dismiss) { this.router.navigate(['/sirio/welcome']); }
                });
            } else {

                // Se verifica si hay alguna taquilla de la agencia abierta
                this.taquillaService.isOpenByAgencia().subscribe(isOpen => {

                    if (isOpen) {

                        mensaje = 'Existen Taquillas Abiertas, Deben Cerrarlas para Proceder al Cierre de la Agencia';
                        this.router.navigate(['/sirio/welcome']);
                        this.swalService.show('No se Puede Efectuar el Cierre', mensaje, { showCancelButton: false }).then((resp) => {
                            if (!resp.dismiss) { this.router.navigate(['/sirio/welcome']); }
                        });
                    } else {

                        mensaje = 'Una Vez Cerrada La Jornada No Podrá Acceder A Las Opciones Principales De Gestión De Efectivo';
                        this.swalService.show('¿Desea Cerrar La Jornada Para La Agencia?', undefined, { 'html': mensaje }).then((resp) => {
                            if (!resp.dismiss) {
                                this.agenciaService.close(this.agencia.id).subscribe(result => {
                                    this.snack.show({ message: 'Agencia Cerrada Exitosamente Para La Jornada!', verticalPosition: 'bottom' });
                                    this.router.navigate(['/sirio/welcome']);
                                });
                            }
                        });
                    }
                });

            }
        });
    }
}
