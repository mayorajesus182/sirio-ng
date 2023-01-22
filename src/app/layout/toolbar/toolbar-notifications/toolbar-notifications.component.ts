import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { SocketService } from 'src/@sirio/services/stomp.service';
import { LIST_FADE_ANIMATION } from '../../../../@sirio/shared/list.animation';

@Component({
  selector: 'sirio-toolbar-notifications',
  templateUrl: './toolbar-notifications.component.html',
  styleUrls: ['./toolbar-notifications.component.scss'],
  animations: [...LIST_FADE_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarNotificationsComponent implements OnInit {
  @ViewChild('tplNotification', { static: true }) notificationTmpl;

  @Output() openQuickPanel = new EventEmitter();

  isOpen: boolean;
  total: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    injector: Injector,
    protected workflowService: WorkflowService,
    protected sessionService: SessionService,
    private stompService: SocketService,
    private notifier: NotifierService,
    private cdr: ChangeDetectorRef
  ) {
  }

  private refreshCount(){

    this.workflowService.pendingQuantity().subscribe(data => {
      this.total.next(data);
      if(data>0){
        this.showNotification();      
      }
      this.cdr.detectChanges();
    });
    
    
  }
  ngOnInit() {
    this.refreshCount();

    const user = this.sessionService.getUser();
    
    if(user && user.username){
      
      this.stompService.subscribe(`/wflow/${user.username}`, (): void => {
        console.log('new message workflow by '+user.username);
        // this.showNotification('warning','¡Nuevas tareas pendientes¡')
        this.refreshCount();
      });

    }


    this.workflowService.notify.subscribe(loaded=>{
      if(loaded){
        this.refreshCount();
      }
    });

    
  }

  private  showNotification( ): void {
    // console.log('enviar notificacion', this.notificationTmpl);
    
		this.notifier.show({
      message: '<i class="fa-light fa-bell-on fa-shake fa-lg"></i> ¡Tienes tareas pendientes¡',
      type: 'warning',
      template: this.notificationTmpl,
    });
	}

}
5