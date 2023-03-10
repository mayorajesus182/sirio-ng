import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { PersonaConstants } from 'src/@sirio/constants/persona.constants';
import { TaskConstants } from 'src/@sirio/constants/task.constants';
import { BovedaAgencia, BovedaAgenciaService } from 'src/@sirio/domain/services/control-efectivo/boveda-agencia.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { ExpedienteService } from 'src/@sirio/domain/services/workflow/expediente.service';
import { Workflow, WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { SocketService } from 'src/@sirio/services/stomp.service';


@Component({
  selector: 'sirio-task-panel',
  templateUrl: './task-panel.component.html',
  styleUrls: ['./task-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})


export class QuickpanelComponent implements OnInit {

  @Input() taskPanel: any;
  public tasks = new BehaviorSubject<Workflow[]>([]);
  bovedaAgencia: BovedaAgencia = {} as BovedaAgencia;
  persona: Persona = {} as Persona;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private sessionService: SessionService,
    private stompService: SocketService,
    protected workflowService: WorkflowService,
    protected expedienteService: ExpedienteService,
    protected bovedaAgenciaService: BovedaAgenciaService,
    protected personaService: PersonaService,
    private cdr: ChangeDetectorRef,
    //  socktask: SocketTask,
  ) {
  }


  private refreshTaskList() {

    this.workflowService.assigned().subscribe(data => {
      this.tasks.next(data);
    });


  }

  ngOnInit() {

    this.refreshTaskList();

    const user = this.sessionService.getUser();

    if (user && user.username) {

      this.stompService.subscribe(`/wflow/${user.username}`, (): void => {
        // console.log('new task workflow by ' + user.username);
        this.refreshTaskList();

      });

    }


    this.router.events.subscribe((routeChange) => {
      if (routeChange instanceof NavigationEnd) {
        this.taskPanel.close();
      }
    });


    this.workflowService.notify.subscribe(loaded => {
      if (loaded) {
        this.refreshTaskList();
      }
    });


  }


  ngOnDestroy() {
    // this._taskSub.unsubscribe();
  }


  callFunction(functionName: string, task: Workflow) {

    if (task.visto) {
      this[functionName](task);
    } else {
      this.workflowService.checkView(task.id).subscribe(data => {
        task.visto = true;
        this.cdr.markForCheck();
        this[functionName](task);
      });
    }
  }


  private wfPaseBovedaTaquilla(task: Workflow) {
    if (task.rol === TaskConstants.CONF_PASE_BOVEDA_TAQUILLA) {
      this.router.navigate(['/sirio/workflow/pase-efectivo/' + task.id + '/' + task.expediente + '/view']);
    } else if (task.rol === TaskConstants.MOD_ANUL_PASE_BOVEDA_TAQUILLA) {
      this.router.navigate(['/sirio/workflow/pase-efectivo/' + task.id + '/' + task.expediente + '/edit']);
    }
  }


  private wfSolicitudPaseTaquillaBoveda(task: Workflow) {
    if (task.rol === TaskConstants.CONF_SOLICITUD_PASE_TAQUILLA_BOVEDA) {
      this.router.navigate(['/sirio/workflow/pase-efectivo/' + task.id + '/' + task.expediente + '/view']);
    } else if (task.rol === TaskConstants.MOD_ANUL_SOLICITUD_PASE_TAQUILLA_BOVEDA) {
      this.router.navigate(['/sirio/workflow/pase-efectivo/' + task.id + '/' + task.expediente + '/edit']);
    }
  }


  private wfPaseTaquillaBoveda(task: Workflow) {
    if (task.rol === TaskConstants.CONF_PASE_TAQUILLA_BOVEDA) {
      this.router.navigate(['/sirio/workflow/pase-boveda/' + task.id + '/' + task.expediente + '/view']);
    } else if (task.rol === TaskConstants.MOD_ANUL_PASE_TAQUILLA_BOVEDA) {
      this.router.navigate(['/sirio/workflow/pase-boveda/' + task.id + '/' + task.expediente + '/edit']);
    }
  }


  // private wfSolicitudRemesa(task: Workflow) {
    //  if (task.rol === TaskConstants.DESPACHO_REMESA_SOLICITADA) {
  //     this.router.navigate(['/sirio/workflow/solicitud-remesa/' + task.id + '/' + task.expediente + '/send']);
  //   }
  // }


  private wfCierreTaquilla(task: Workflow) {
    this.router.navigate(['/sirio/workflow/cierre-taquilla/' + task.id + '/' + task.expediente + '/view']);
  }


  private wfRevisionCliente(task: Workflow) {

    if (task.rol == TaskConstants.CHEQUEAR_CLIENTE) {
      this.personaService.getByExpediente(task.expediente).subscribe(data => {
        this.persona = data;
        const personType = data.tipoPersona == PersonaConstants.PERSONA_NATURAL ? 'natural' : 'juridico';
        this.router.navigate(['/sirio/workflow/' + personType + '/' + task.expediente + '/check']);
      });
    } 
  }


  private wfCreacionPlazoFijo(task: Workflow) {
    if (task.rol == TaskConstants.APROBAR_RECHAZAR_PLAZO_FIJO) {
        this.router.navigate(['/sirio/workflow/plazo-fijo/' + task.id + '/' + task.expediente + '/approve']);
    } else if (task.rol == TaskConstants.ACTIVAR_ANULAR_PLAZO_FIJO) { 
      this.router.navigate(['/sirio/workflow/plazo-fijo/' + task.id + '/' + task.expediente + '/activate']);
    }
  }



}







