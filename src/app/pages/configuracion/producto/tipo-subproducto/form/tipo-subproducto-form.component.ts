import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoProducto, TipoProductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';
import { TipoSubproducto, TipoSubproductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-subproducto.service';
import { TipoPersona, TipoPersonaService } from 'src/@sirio/domain/services/configuracion/tipo-persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tipo-subproducto-form',
    templateUrl: './tipo-subproducto-form.component.html',
    styleUrls: ['./tipo-subproducto-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TipoSubproductoFormComponent extends FormBaseComponent implements OnInit {

    public tipoProductos = new BehaviorSubject<TipoProducto[]>([]);
    public tipoPersonas = new BehaviorSubject<TipoPersona[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    constants = GlobalConstants;
    tipoSubproducto: TipoSubproducto = {} as TipoSubproducto;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoSubproductoService: TipoSubproductoService,
        private tipoPersonaService: TipoPersonaService,
        private tipoProductoService: TipoProductoService,
        private monedaService: MonedaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tipoSubproductoService.get(id).subscribe((agn: TipoSubproducto) => {
                this.tipoSubproducto = agn;
                this.buildForm(this.tipoSubproducto);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tipoSubproducto);
            this.loadingDataForm.next(false);
        }

        if(!id){
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }
        
        this.tipoProductoService.actives().subscribe(data => {
            this.tipoProductos.next(data);
        });

        this.tipoPersonaService.actives().subscribe(data => {
            this.tipoPersonas.next(data);
        });

        this.monedaService.actives().subscribe(data => {
            this.monedas.next(data);
        });


    }

    buildForm(tipoSubproducto: TipoSubproducto) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: tipoSubproducto.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(tipoSubproducto.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            codigoLocal: new FormControl(tipoSubproducto.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            tipoPersona: new FormControl(tipoSubproducto.tipoPersona || undefined, [Validators.required]),
            tipoProducto: new FormControl(tipoSubproducto.tipoProducto || undefined, [Validators.required]),
            moneda: new FormControl(tipoSubproducto.moneda || undefined, [Validators.required]),
            conChequera: new FormControl(tipoSubproducto.conChequera || false),
            conLibreta: new FormControl(tipoSubproducto.conLibreta || false),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tipoSubproducto);

        this.tipoSubproducto.conChequera = this.tipoSubproducto.conChequera ? 1 : 0;
        this.tipoSubproducto.conLibreta = this.tipoSubproducto.conLibreta ? 1 : 0;

        this.saveOrUpdate(this.tipoSubproductoService, this.tipoSubproducto, 'El Tipo de Subproducto', this.isNew);
    }

    private codigoExists(id) {
        this.tipoSubproductoService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tipoSubproducto.id) {
            this.applyChangeStatus(this.tipoSubproductoService, this.tipoSubproducto, this.tipoSubproducto.nombre, this.cdr);
        }
    }

}
