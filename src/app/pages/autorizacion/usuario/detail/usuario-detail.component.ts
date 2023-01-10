import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { UsuarioService } from 'src/@sirio/domain/services/autorizacion/usuario.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
  selector: 'sirio-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrls: ['./usuario-detail.component.scss'],
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class UsuarioDetailComponent extends FormBaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService) {
    super(undefined, injector);
  }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];

    this.loadingDataForm.next(true);

    this.usuarioService.get(id).subscribe(data => {
      this.data = data;
      this.loadingDataForm.next(false);
    });

  }



}
