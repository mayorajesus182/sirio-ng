import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { TasaDPF, TasaDPFService } from 'src/@sirio/domain/services/configuracion/plazo-fijo/tasa-dpf.service';
import { TipoTasa, TipoTasaService } from 'src/@sirio/domain/services/configuracion/plazo-fijo/tipo-tasa.service';
import { TipoProducto, TipoProductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';
import { TipoSubproducto, TipoSubproductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-subproducto.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-tasa-dpf-form',
    templateUrl: './tasa-dpf-form.component.html',
    styleUrls: ['./tasa-dpf-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TasaDPFFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    tasaDPF: TasaDPF = {} as TasaDPF;
    public tipos = new BehaviorSubject<TipoTasa[]>([]);
    public productos = new BehaviorSubject<TipoProducto[]>([]);
    public subproductos = new BehaviorSubject<TipoSubproducto[]>([]);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tasaDPFService: TasaDPFService,
        private tipoTasaService: TipoTasaService,
        private tipoProductoService: TipoProductoService,
        private tipoSubproductoService: TipoSubproductoService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {
            if (!loading) {
                if (this.itemForm && this.f.tipoProducto.value) {
                    this.tipoSubproductoService.activesByTipoProducto(this.f.tipoProducto.value).subscribe(data => {
                        this.subproductos.next(data);
                    });
                }
                this.cdr.detectChanges();
            }
        });
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.tasaDPFService.get(id).subscribe((agn: TasaDPF) => {
                this.tasaDPF = agn;
                this.buildForm(this.tasaDPF);             
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.tasaDPF);
            this.loadingDataForm.next(false);
        }

        this.tipoProductoService.actives().subscribe(data => {
            this.productos.next(data);
        });

        this.tipoTasaService.actives().subscribe(data => {
            this.tipos.next(data);
        });

        if (!id) {
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }
    }

    buildForm(tasaDPF: TasaDPF) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: tasaDPF.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            tipoTasa: new FormControl(tasaDPF.tipoTasa || undefined, [Validators.required]),
            porcentaje: new FormControl(tasaDPF.porcentaje || undefined, [Validators.required]),
            tipoProducto: new FormControl(tasaDPF.tipoProducto || undefined, [Validators.required]),
            tipoSubproducto: new FormControl(tasaDPF.tipoSubproducto || undefined, [Validators.required]),
            minimo: new FormControl(tasaDPF.minimo || undefined, [Validators.required]),
            maximo: new FormControl(tasaDPF.maximo || undefined, [Validators.required]),
            codigoLocal: new FormControl(tasaDPF.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)])
        });

        this.f.tipoProducto.valueChanges.subscribe(value => {
            this.f.tipoSubproducto.setValue(undefined);
            if (value) {
                this.tipoSubproductoService.activesByTipoProducto(value).subscribe(data => {
                    this.subproductos.next(data);
                    this.cdr.detectChanges();
                });
            }
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.tasaDPF);
        this.saveOrUpdate(this.tasaDPFService, this.tasaDPF, 'La Tasa', this.isNew);
    }

    private codigoExists(id) {
        this.tasaDPFService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.tasaDPF.id) {
            this.applyChangeStatus(this.tasaDPFService, this.tasaDPF, this.tasaDPF.id, this.cdr);
        }
    }

}
