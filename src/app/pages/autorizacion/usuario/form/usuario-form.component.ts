import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants, RolConstants } from 'src/@sirio/constants';
import { Perfil, PerfilService } from 'src/@sirio/domain/services/autorizacion/perfil.service';
import { Usuario, UsuarioService } from 'src/@sirio/domain/services/autorizacion/usuario.service';
import { Region, RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { Telefonica, TelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
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
    public roles = new BehaviorSubject<Rol[]>([]);
    public agencias = new BehaviorSubject<Agencia[]>([]);
    public regiones = new BehaviorSubject<Region[]>([]);
    public transportistas = new BehaviorSubject<Transportista[]>([]);
    rolConstant = RolConstants;

    agenciaMandatory: string[] = [
        this.rolConstant.GERENTE_TESORERO_AGENCIA,
        this.rolConstant.OPERADOR_TAQUILLA
    ]



    public agencyRols: string[] = [];

    @ViewChild('username') username: ElementRef;
    @ViewChild('email') email: ElementRef;


    public telefonicaMovilList = new BehaviorSubject<Telefonica[]>([]);
    public telefonicaFijaList = new BehaviorSubject<Telefonica[]>([]);
    constructor(

        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private telefonicaService: TelefonicaService,
        private usuarioService: UsuarioService,
        private perfilService: PerfilService,
        private rolService: RolService,
        private agenciaService: AgenciaService,
        private regionService: RegionService,
        private transportistaService: TransportistaService,

        private cdr: ChangeDetectorRef) {
        super(undefined, injector)
    }
    ngAfterViewInit(): void {

        this.loading$.subscribe(loading => {
            if (loading == false) {
                // finalizo la  carga de info, cargo las dependencias
                this.perfilService.actives().subscribe(data => {
                    console.log(data);

                    this.perfiles.next(data);
                    if (this.f.perfil.value) {
                        this.f.perfil.setValue(this.usuario.perfil);
                        this.cdr.detectChanges();
                    }
                });

                this.rolService.actives().subscribe(data => {
                    console.log(data);

                    this.roles.next(data);
                });

                this.agenciaService.actives().subscribe(data => {
                    // console.log(data);

                    this.agencias.next(data);
                });

                this.regionService.actives().subscribe(data => {
                    // console.log(data);

                    this.regiones.next(data);
                });

                this.transportistaService.actives().subscribe(data => {
                    // console.log(data);

                    this.transportistas.next(data);
                });


                this.eventFromElement(this.username, 'keyup')?.subscribe(() => {
                    // this.filterChange.emit(this.filter.nativeElement.value);
                    if (!this.f.id.errors && this.username.nativeElement.value.length > 4) {
                        this.codigoExists(this.username.nativeElement.value);
                    }
                });


                this.eventFromElement(this.email, 'keyup')?.subscribe(() => {
                    // this.filterChange.emit(this.filter.nativeElement.value);
                    if (!this.f.email.errors && this.email.nativeElement.value.length > 4) {
                        this.emailExists(this.email.nativeElement.value);
                    }
                });

                this.f.rol.valueChanges.subscribe(val => {
                    // reiniciar los campos que depende del rol, para que no queden obligatorios
                    this.f.region.setValue(undefined);
                    this.f.agencia.setValue(undefined);
                    this.f.transportista.setValue(undefined);

                    this.f.region.setErrors(undefined);
                    this.f.agencia.setErrors(undefined);
                    this.f.transportista.setErrors(undefined);


                })



                this.telefonicaService.activesByTipoTelefonica(GlobalConstants.TELEFONO_FIJO).subscribe(data => {
                    this.telefonicaFijaList.next(data);
                })

                this.telefonicaService.activesByTipoTelefonica(GlobalConstants.TELEFONO_MOVIL).subscribe(data => {
                    this.telefonicaMovilList.next(data);
                })
            }
        });
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);
        if (id) {
            this.usuarioService.get(id).subscribe((usr: Usuario) => {
                this.usuario = usr;
                // console.log('usr ', usr);
                this.buildForm();
                this.itemForm.controls['id'].disable();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm();
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


    buildForm() {
        this.itemForm = this.fb.group({
            id: new FormControl({value:this.usuario.id || '',disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            identificacion: new FormControl(this.usuario.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(this.usuario.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            email: new FormControl(this.usuario.email || '', [Validators.required]),
            ldap: new FormControl(this.usuario.ldap || false),
            perfil: new FormControl(this.usuario.perfil || undefined, [Validators.required]),
            rol: new FormControl(this.usuario.rol || undefined),
            region: new FormControl(this.usuario.region || undefined),
            agencia: new FormControl(this.usuario.agencia || undefined),
            transportista: new FormControl(this.usuario.transportista || undefined),
            telefonoMovil: new FormControl(this.usuario.telefonoMovil || undefined),
            telefonoLocal: new FormControl(this.usuario.telefonoLocal || undefined),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;
        this.updateData(this.usuario);

        console.log(this.usuario);

        this.usuario.ldap = this.usuario.ldap ? 1 : 0;


        this.saveOrUpdate(this.usuarioService, this.usuario, 'El Usuario', this.isNew);
        // this.todoService.updateTodo(this.todo).subscribe(res => {
        //   this.router.navigateByUrl("/todo/list");
        // });
    }

    private codigoExists(id) {
        this.usuarioService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    usuarioExists: "El código de usuario ya existe"
                });
                this.cdr.detectChanges();
            }
            if (this.f.email.value && this.f.email.value.length > 0) {

                this.emailExists(this.f.email.value);
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
        this.usuarioService.existsEmail(this.itemForm.value.id, email).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['email'].setErrors({
                    emailExists: "El Email ya esta registrado"
                });
                this.cdr.detectChanges();
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

