
import { Component, Inject, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { UserIdleService } from 'angular-user-idle';



@Component({
  selector: 'sirio-idle-message',
  templateUrl: './idle-message.component.html',
})
export class IdleSnackComponent {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  public countdown: number=100;
  public seconds: number;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<IdleSnackComponent>,
    private userIdle: UserIdleService,
  ) {

  }

  ngOnInit() {
    
    // this.userIdle.onTimeoutWarning.subscribe((countdown) => {
    //  console.log('countdown '+countdown);
      // this.countdown = Math.round((countdown * 100) / 15);
      // this.seconds = countdown;
    // });

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => {
      
      console.log('timer ', count);
    });

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
     
      // this.seconds = countdown;
      console.log('Time is up!');
      
    });
    
    // this.userIdle.onIdleEnd.subscribe(() => {
    //   console.log('close dialogo after idle end');
    //   // this.snackBar.dismiss();
    // });

  }

  stop(){
    
    this.snackBarRef.dismissWithAction();
  }

 

}
