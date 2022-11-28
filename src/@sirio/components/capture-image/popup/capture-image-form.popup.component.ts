import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-capture-image-form.popup',
  templateUrl: './capture-image-form.popup.component.html',
  styleUrls: ['./capture-image-form.popup.component.scss']
})
export class CaptureImageFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {
  @Output() returnPictures = new EventEmitter<WebcamImage[]>();
  showWebcam = true;
  isCameraExist = true;

  errors: WebcamInitError[] = [];
  images: WebcamImage[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<CaptureImageFormPopupComponent>,
    private cdref: ChangeDetectorRef,
  
  ) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

    this.cdref.markForCheck();

  }

  ngOnInit() {

    if (this.defaults.id) {
      this.mode = 'global.edit';
    } else {
      this.defaults = {} as any;
    }

    this.cdref.markForCheck();

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
      });

  }



  takeSnapshot(): void {
    this.trigger.next();
  }

  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage) {
    // this.getPicture.emit(webcamImage);
    console.log();
    
    this.images.push(webcamImage);

    // this.showWebcam = false;
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  save() {
    console.log('mode ', this.mode);

    this.dialogRef.close(
      {
      });

  }
  

  close() {

    this.dialogRef.close(
      {
      });

  }

  clearAll() {
    // this.cdref.detectChanges();
  }


}
