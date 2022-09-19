import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { AuthService } from 'src/@sirio/domain/services/security/auth.service';
import { fadeInUpAnimation } from '../../../../@sirio/animations/fade-in-up.animation';

@Component({
  selector: 'sirio-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fadeInUpAnimation]
})
export class LoginComponent implements OnInit {
  @ViewChild(MatButton) submitButton: MatButton;
  form: FormGroup;

  inputType = 'password';
  visible = false;

  constructor(
    private userIdle: UserIdleService,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
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


    // this.loadingDataForm.next(true);
    this.authService
      .attemptAuth(signinData)
      .subscribe(
        data => {

          this.submitButton.disabled = false;
          // this.router.navigate(["/sirio/personas"]);
          this.router.navigateByUrl('/sirio/personas');

          this.snackbar.open('Authentication Success', 'Close', {
            duration: 8000,
            horizontalPosition: 'center',
            panelClass: 'success-snackbar'
          });

          this.userIdle.startWatching();

        },
        err => {

          this.snackbar.open('Authentication Faild', 'Close', {
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
