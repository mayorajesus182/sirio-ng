import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Idle } from '@ng-idle/core';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'src/@sirio/domain/services/security/auth.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';

@Component({
  selector: 'sirio-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInUpAnimation]
})
export class LoginComponent implements OnInit {
  @ViewChild('btnAuth') submitButton: MatButton;
  form: FormGroup;

  inputType = 'password';
  visible = false;
  success = '';
  error = '';

  constructor(
    private userIdle: Idle,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private authService: AuthService,

    private sessionService: SessionService
  ) {
  }

  ngOnInit() {

    this.userIdle.stop();

    this.success = this.translate.instant('message.successfulLogin');

    this.error = this.translate.instant('message.loginError');

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });


    this.authService.purgeAuth();
    this.sessionService.reset();
  }

  send() {

    if (this.form.invalid) {
      return;
    }
    const signinData = this.form.value;
    // this.snackbar.open('Lucky you! Looks like you didn\'t need a password or email address! For a real application we provide validators to prevent this. ;)', 'LOL THANKS', {
    //   duration: 10000
    // });

    this.submitButton.disabled = true;

    this.authService
      .attemptAuth(signinData)
      .subscribe(
        data => {
          this.submitButton.disabled = false;
          this.router.navigateByUrl('/sirio/welcome');
          this.snackbar.open(this.success, 'Close', {
            duration: 8000,
            horizontalPosition: 'center',
            panelClass: 'success-snackbar'
          });



        },
        err => {

          this.snackbar.open(this.error, 'Close', {
            duration: 8000,
            horizontalPosition: 'center',
            panelClass: 'danger-snackbar'
          });
          this.submitButton.disabled = false;
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
