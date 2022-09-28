import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Component, ElementRef, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


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
  formData2: FormGroup;
  // formTelefono:FormGroup;
  // formDireccion:FormGroup;

  constructor(
    private fb: FormBuilder) {

  }


  get form() {
    return !this.formData ? {} : this.formData.controls;
  }

  get form2() {
    return !this.formData2 ? {} : this.formData2.controls;
  }

  ngOnInit() {

    this.formData = this.fb.group({
      fecha:new FormControl('',Validators.required),
      monto:new FormControl(undefined,Validators.required),
      telefono:new FormControl('',Validators.required),
      telefonoAlt:new FormControl('',Validators.required),
      email: new FormControl('',[Validators.required, Validators.email] )
    })

    // this.formData.markAsTouched();

    this.formData2 = this.fb.group({
      mostrar:[false],
      fecha:new FormControl('',Validators.required),
      monto:new FormControl(undefined,Validators.required),
      telefono:new FormControl('',Validators.required)
    })
    
  }


  save(){
      if(this.formData.invalid){
        return;
      }
      console.log('send form data to server');
      
  }

  save2(){
      if(this.formData2.invalid){
        return;
      }
      console.log('send form data 2 to server');
      
  }

}
