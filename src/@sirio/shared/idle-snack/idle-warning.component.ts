
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { Idle } from '@ng-idle/core';




@Component({
  selector: 'sirio-idle-warning',
  templateUrl: './idle-warning.component.html',
  styleUrls: ['./idle-warning.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IdleWarningComponent {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  
  public seconds: number;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private userIdle: Idle,
    public snackBarRef: MatSnackBarRef<IdleWarningComponent>,
    
  ) {

  }

  ngOnInit() {
    
    // this.userIdle.onTimeoutWarning.subscribe((countdown) => {
    //  console.log('countdown '+countdown);
      // this.countdown = Math.round((countdown * 100) / 15);
      // this.seconds = countdown;
    // });
       
    this.userIdle.onTimeoutWarning.subscribe((countdown) => {
      this.seconds = countdown;
      // this.idleState = 'You will time out in ' + countdown + ' seconds!'
      console.log('You will time out in ' + countdown + ' seconds!');
    });


  }

  stop(){
    
    this.snackBarRef.dismissWithAction();
  }

 

}
