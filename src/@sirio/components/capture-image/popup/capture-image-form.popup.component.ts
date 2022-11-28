import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Injector, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';
// import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import { ImageCroppedEvent } from "ngx-image-cropper";

@Component({
  selector: 'sirio-capture-image-form.popup',
  templateUrl: './capture-image-form.popup.component.html',
  styleUrls: ['./capture-image-form.popup.component.scss']
})
export class CaptureImageFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {
  @Output() returnPictures = new EventEmitter<WebcamImage[]>();
  showWebcam = true;
  isCameraExist = true;

  worker: Tesseract.Worker = createWorker();
  errors: WebcamInitError[] = [];
  images: WebcamImage[] = [];

  // worker: Tesseract.Worker = Tesseract.createWorker();
  isReady: boolean;
  imageChangedEvent: any;
  base64Image: any;
  ocrResult: string;
  croppedImage: any = "";
  isScanning: boolean;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<CaptureImageFormPopupComponent>,
    private cdref: ChangeDetectorRef,

  ) {

    super(dialogRef, injector)
    this.initialize();
  }

  async initialize(): Promise<void> {

    await this.worker.load();
    await this.worker.loadLanguage("es");
    await this.worker.initialize("es");
    this.isReady = true;
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



  scanOCR() {
    this.isScanning = true;
    this.imageChangedEvent = null;
    this.doOCR(this.croppedImage);
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent): void {
    console.log(event);
    //this.doOCR(event.base64);
    this.croppedImage = event.base64;
    this.base64Image = event.base64;
  }

  async doOCR(base64Image: string) {
    this.ocrResult = "Scanning";
    console.log(`Started: ${new Date()}`);
    if (this.isReady) {
      const data = await this.worker.recognize(base64Image);
      console.log(data);
      this.ocrResult = data.data.text;
    }
    // await this.worker.terminate();
    console.log(`Stopped: ${new Date()}`);
    this.isScanning = false;
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
