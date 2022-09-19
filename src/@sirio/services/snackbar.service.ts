import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarRef} from '@angular/material/snack-bar';

interface SnackMessage {
  message: string,
  action?: string,
  type?: string,
  timeout?: number,
  verticalPosition?:MatSnackBarVerticalPosition;
  horizontalPosition?:MatSnackBarHorizontalPosition;
}

@Injectable(
  {
    providedIn: 'root',
  }
)
export class SnackbarService {

  constructor(private snack: MatSnackBar ) { }

  public show(data: SnackMessage,component?:any):MatSnackBarRef<any> {
    let config = new MatSnackBarConfig();
    config.verticalPosition = data.verticalPosition || 'top';
    config.horizontalPosition = data.horizontalPosition || 'center';
    config.duration = data.timeout || 5000;
    config.panelClass = ['success-snackbar'];
    if (data.type !== undefined){
        if (data.type === 'danger'){
            config.panelClass = ['danger-snackbar'];
        }else if(data.type === 'black'){
            config.panelClass = ['black-snackbar'];
        }else if(data.type === 'genial'){
            config.panelClass = ['purple-snackbar'];
        }else {
            config.panelClass = ['info-snackbar'];
        }
    }
    if(!component){

      return this.snack.open(data.message, data.action, config);
    }else{
      return this.snack.openFromComponent(component,  config);

    }
  }
}
