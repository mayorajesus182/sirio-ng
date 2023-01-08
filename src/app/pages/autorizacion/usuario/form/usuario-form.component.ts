import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Perfil, PerfilService } from 'src/@sirio/domain/services/autorizacion/perfil.service';
import { Usuario, UsuarioService } from 'src/@sirio/domain/services/autorizacion/usuario.service';
import { Rol, RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';


@Component({
    selector: 'app-usuario-form',
    templateUrl: './usuario-form.component.html',
    styleUrls: ['./usuario-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class UsuarioFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    usuario: Usuario = {} as Usuario;
    public perfiles = new BehaviorSubject<Perfil[]>([]);
    public rols = new BehaviorSubject<Rol[]>([]);
    constructor(

        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private usuarioService: UsuarioService,
        private perfilService: PerfilService,
        private rolService: RolService,
        private cdr: ChangeDetectorRef) {
        super(undefined,injector)
    }
    ngAfterViewInit(): void {

        this.loading$.subscribe(loaded => {
            if (!loaded) {

                this.perfilService.actives().subscribe(data => {
                    // console.log(data);

                    this.perfiles.next(data);
                    this.cdr.detectChanges();
                });

                this.rolService.actives().subscribe(data => {
                    // console.log(data);

                    this.rols.next(data);
                    this.cdr.detectChanges();
                });


                this.f.id.valueChanges.subscribe(value => {
                    if (!this.f.id.errors && this.f.id.value.length > 0) {
                        this.codigoExists(value);
                    }
                    if (!this.f.id.errors && this.f.id.value.length > 4) {
                        this.codigoExists(value);
                    }
                });

                this.f.email.valueChanges.subscribe(value => {
                    if (!this.f.email.errors && this.f.email.value.length > 0) {
                        this.emailExists(value);
                    }
                });


            }
        });
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);
        if (id) {
            this.usuarioService.get(id).subscribe((art: Usuario) => {
                this.usuario = art;
                console.log('usr ', art);
                this.buildForm(this.usuario);
                this.itemForm.controls['id'].disable();
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
            });
        } else {
            this.buildForm(this.usuario);
            this.itemForm.controls['email'].disable();
            this.f.id.valueChanges.subscribe(value => {
                if (!value || value == '') {
                    this.itemForm.controls['email'].disable();
                } else {
                    this.itemForm.controls['email'].enable();
                }
            });

            this.loadingDataForm.next(false);
        }


    }


    buildForm(usuario: Usuario) {
        this.itemForm = this.fb.group({
            id: new FormControl(usuario.id || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            identificacion: new FormControl(usuario.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(usuario.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            email: new FormControl(usuario.email || '', [Validators.required]),
            ldap: new FormControl(usuario.ldap || false),
            perfil: new FormControl(usuario.perfil || undefined, [Validators.required]),
            // roles: new FormControl(usuario.roles || undefined, [Validators.required]),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;
        this.updateData(this.usuario);

        console.log(this.usuario);


        this.saveOrUpdate(this.usuarioService, this.usuario, 'El Usuario', this.isNew);
        // this.todoService.updateTodo(this.todo).subscribe(res => {
        //   this.router.navigateByUrl("/todo/list");
        // });
    }

    private codigoExists(id) {
        this.usuarioService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    usuarioExists: "El usuario existe, ingrese uno distinto"
                });
            }
        });
    }
    private userLdapExists(id) {
        this.usuarioService.existsLdap(id).subscribe(data => {
            console.log(data);

            if (data.exists) {
                // this.itemForm.controls['id'].setErrors({
                //     usuarioExists: "El usuario existe, ingrese uno distinto"
                // });
            }
        });
    }

    private emailExists(email) {
        this.usuarioService.existsEmail(email, this.itemForm.value.id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['email'].setErrors({
                    emailExists: "El Email ya esta registrado"
                });
            }
        });
    }

    // updateTodoTag(id: number) {
    //   if (!this.todo.tag.includes(id)) {
    //     this.todo.tag.push(id);
    //     this.cdr.markForCheck();
    //   }
    // }

    // removeTagFromTodo(tagId) {
    //   this.todo.tag.splice(this.todo.tag.indexOf(tagId), 1);
    //   this.cdr.markForCheck();
    // }

}

    // openTagManaginDialogue() {
    //   const dialogRef = this.tagDialogue.open(TagDialogueComponent, {
    //     // width: '250px',
    //     // data: {name: "", animal: ""}
    //   });

    //   dialogRef.afterClosed().subscribe(result => {
    //     this.getTagList();
    //   });
    // }

