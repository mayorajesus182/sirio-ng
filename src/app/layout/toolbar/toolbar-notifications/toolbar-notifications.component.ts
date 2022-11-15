import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
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

  @Output() openQuickPanel = new EventEmitter();

  isOpen: boolean;
  total: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    injector: Injector,
    protected workflowService: WorkflowService,
    protected sessionService: SessionService,
    private stompService: SocketService,
    private cdr: ChangeDetectorRef
  ) {
  }

  private refreshCount(){

    this.workflowService.pendingQuantity().subscribe(data => {
      this.total.next(data);
      this.cdr.detectChanges();
    });

    
  }
  ngOnInit() {
    this.refreshCount();

    const user = this.sessionService.getUser();

    if(user && user.username){
      
      this.stompService.subscribe(`/wflow/${user.username}`, (): void => {
        console.log('new message workflow by '+user.username);
        
        this.refreshCount();
      });

    }

    
  }

}
5