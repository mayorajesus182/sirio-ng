
import { Component, Inject, ViewChild } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSnackBar, MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';




@Component({
  selector: 'sirio-idle-message',
  templateUrl: './idle-message.component.html',
  styleUrls: ['./idle-message.component.scss'],
})
export class IdleSnackComponent {
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  public countdown: number=100;
  public seconds: number;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<IdleSnackComponent>,
    
  ) {

  }

  ngOnInit() {
    
    // this.userIdle.onTimeoutWarning.subscribe((countdown) => {
    //  console.log('countdown '+countdown);
      // this.countdown = Math.round((countdown * 100) / 15);
      // this.seconds = countdown;
    // });


  }

  stop(){
    
    this.snackBarRef.dismissWithAction();
  }

 

}
