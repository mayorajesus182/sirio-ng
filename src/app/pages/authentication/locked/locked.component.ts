import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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


  form = this.fb.group({
    password: [null, Validators.required]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,

    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
  }

  send() {
    this.router.navigate(['/sirio/welcome']);
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
