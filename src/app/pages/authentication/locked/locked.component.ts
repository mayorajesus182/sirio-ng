import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { AuthService, User } from 'src/@sirio/domain/services/security/auth.service';
import { JwtService } from 'src/@sirio/services/jwt.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { SnackbarService } from 'src/@sirio/services/snackbar.service';
import { fadeInUpAnimation } from '../../../../@sirio/animations/fade-in-up.animation';

@Component({
  selector: 'sirio-locked',
  templateUrl: './locked.component.html',
  styleUrls: ['./locked.component.scss'],
  animations: [fadeInUpAnimation]
})
export class LockedComponent implements OnInit {

  inputType = 'password';
  visible = false;
  user:User;
  fullName:string;
  username:string;
  @ViewChild(MatButton) submitButton: MatButton;

  public form: FormGroup;



  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private userIdle:Idle,
    private cd: ChangeDetectorRef,
    private snack: SnackbarService,
    private jwtService: JwtService,
    private sessionService:SessionService
  ) { }

  ngOnInit() {
    this.user=this.sessionService.getUser();
    this.userIdle.stop();
    this.fullName=this.user.fullName;
    this.username=this.user.username;

    this.jwtService.destroyToken()

   this.form= this.fb.group({
      password: [null, Validators.required],
      username: [this.username, Validators.required]
    });

  }

  send() {
    if(this.form.invalid){
      return;
    }

    this.submitButton.disabled = true;



    this.authService.unLockscreen(this.form.value).subscribe(
      data => {
        this.submitButton.disabled = false;
        this.sessionService.reset();
        this.router.navigate(['/sirio/welcome']);
      },err => {
        console.log('error ',err);
        this.submitButton.disabled = false;
        // this.progressBar.mode = 'determinate';
        this.snack.show({ message: 'Problemas para desbloquear la sesión!', type: 'danger' });

      }
    );

  }


  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
