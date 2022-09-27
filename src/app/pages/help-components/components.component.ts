import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Component, ElementRef, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { fadeInRightAnimation } from '../../../@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from '../../../@sirio/animations/fade-in-up.animation';
import { LayoutService } from '../../layout/layout.service';

@Component({
  selector: 'sirio-help-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})
export class HelpComponentsComponent implements OnInit {


  private _gap = 16;
  gap = `${this._gap}px`;
  col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
  col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;
  hasBasicData = true;
  isNew = true;

  formData: FormGroup;
  // formTelefono:FormGroup;
  // formDireccion:FormGroup;

  constructor(
    private fb: FormBuilder) {

  }


  get form() {
    return !this.formData ? {} : this.formData.controls;
  }

  ngOnInit() {

    this.formData = this.fb.group({
      fecha:['',Validators.required],
      monto:[undefined,Validators.required],
      telefono:['',Validators.required],
      telefonoAlt:['',Validators.required],
      email:['',[Validators.required, Validators.email] ]
    })
    
  }

}
