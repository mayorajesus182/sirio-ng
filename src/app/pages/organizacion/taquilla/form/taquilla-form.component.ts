import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Usuario, UsuarioService } from 'src/@sirio/domain/services/autorizacion/usuario.service';
import { Taquilla, TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-taquilla-form',
    templateUrl: './taquilla-form.component.html',
    styleUrls: ['./taquilla-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TaquillaFormComponent extends FormBaseComponent implements OnInit {

    taquilla: Taquilla = {} as Taquilla;
    public usuarios = new BehaviorSubject<Usuario[]>([]);

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private taquillaService: TaquillaService,
        private usuarioService: UsuarioService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.taquillaService.get(id).subscribe((agn: Taquilla) => {
                this.taquilla = agn;
                this.buildForm(this.taquilla);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.taquilla);
            this.loadingDataForm.next(false);
        }

        this.usuarioService.actives().subscribe(data => {
            this.usuarios.next(data);
        });

    }

    buildForm(taquilla: Taquilla) {
        this.itemForm = this.fb.group({
            nombre: new FormControl(taquilla.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            usuario: new FormControl(taquilla.usuario || undefined),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.taquilla);
        this.saveOrUpdate(this.taquillaService, this.taquilla, 'La Taquilla', this.isNew);
    }

    activateOrInactivate() {
        if (this.taquilla.id) {
            this.applyChangeStatus(this.taquillaService, this.taquilla, this.taquilla.nombre, this.cdr);
        }
    }

}
