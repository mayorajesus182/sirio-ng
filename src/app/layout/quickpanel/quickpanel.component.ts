import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TaskConstants } from 'src/@sirio/constants/task.constants';
import { BovedaAgencia, BovedaAgenciaService } from 'src/@sirio/domain/services/control-efectivo/boveda-agencia.service';
import { ExpedienteService } from 'src/@sirio/domain/services/workflow/expediente.service';
import { Workflow, WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';


@Component({
  selector: 'sirio-quickpanel',
  templateUrl: './quickpanel.component.html',
  styleUrls: ['./quickpanel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})


export class QuickpanelComponent implements OnInit {

  @Input() notificPanel;
  // private _taskSub: Subscription;
  public tasks = new BehaviorSubject<Workflow[]>([]);
  bovedaAgencia: BovedaAgencia = {} as BovedaAgencia;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected workflowService: WorkflowService,
    protected expedienteService: ExpedienteService,
    protected bovedaAgenciaService: BovedaAgenciaService,
    private cdr: ChangeDetectorRef,
    //  socktask: SocketTask,
  ) {
  }

  ngOnInit() {

    // this.socktask.instance();

    this.workflowService.assigned().subscribe(data => {
      this.tasks.next(data);;
    });

    this.router.events.subscribe((routeChange) => {
      if (routeChange instanceof NavigationEnd) {
        this.notificPanel.close();
      }
    });


    // this._taskSub = this.socktask.notify.subscribe(event => {

    //     console.log('event task task.component', event);
    //     if (event) {

    //         this.workflowService.assignedList().subscribe(data => {
    //             this.tasks = data;
    //         });

    //     }

    // });


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
      this.router.navigate(['/sirio/workflow/pase-efectivo/'+task.id+'/'+task.expediente+'/view']);
    } else if (task.rol === TaskConstants.MOD_ANUL_PASE_BOVEDA_TAQUILLA) {
      this.router.navigate(['/sirio/workflow/pase-efectivo/'+task.id+'/'+task.expediente+'/edit']);
    }
  }

  private wfSolicitudPaseTaquillaBoveda(task: Workflow) {
    if (task.rol === TaskConstants.CONF_SOLICITUD_PASE_TAQUILLA_BOVEDA) {
      this.router.navigate(['/sirio/workflow/pase-efectivo/'+task.id+'/'+task.expediente+'/view']);
    } else if (task.rol === TaskConstants.MOD_ANUL_SOLICITUD_PASE_TAQUILLA_BOVEDA) {
      this.router.navigate(['/sirio/workflow/pase-efectivo/'+task.id+'/'+task.expediente+'/edit']);
    }
  }

  private wfPaseTaquillaBoveda(task: Workflow) {
    if (task.rol === TaskConstants.CONF_PASE_TAQUILLA_BOVEDA) {
      this.router.navigate(['/sirio/workflow/pase-boveda/'+task.id+'/'+task.expediente+'/view']);
    } else if (task.rol === TaskConstants.MOD_ANUL_PASE_TAQUILLA_BOVEDA) {
      this.router.navigate(['/sirio/workflow/pase-boveda/'+task.id+'/'+task.expediente+'/edit']);
    }
  }
  

  // private wfDesincorporacion(id: string) {
  //   this.router.navigate([`workflow/${id}/desincorporacion`]);
  // }

  // private wfMantenimiento(id: string) {
  //   this.router.navigate([`workflow/${id}/mantenimiento`]);
  // }

}



























// import { Component, OnInit } from '@angular/core';
// import * as moment from 'moment';

// @Component({
//   selector: 'sirio-quickpanel',
//   templateUrl: './quickpanel.component.html',
//   styleUrls: ['./quickpanel.component.scss']
// })
// export class QuickpanelComponent implements OnInit {

//   todayDay: string;
//   todayDate: string;
//   todayDateSuffix: string;
//   todayMonth: string;

//   constructor() { }

//   ngOnInit() {
//     this.todayDay = moment().format('dddd');
//     this.todayDate = moment().format('Do');
//     this.todayDate = this.todayDate.replace(/\D/g, '');
//     this.todayDateSuffix = moment().format('Do');
//     this.todayDateSuffix = this.todayDateSuffix.replace(/[0-9]/g, '');
//     this.todayMonth = moment().format('MMMM');
//   }

// }
