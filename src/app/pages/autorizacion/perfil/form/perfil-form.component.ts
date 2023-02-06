import { FlatTreeControl, TreeControl } from '@angular/cdk/tree';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Perfil, PerfilService } from 'src/@sirio/domain/services/autorizacion/perfil.service';
import { Permiso, PermisoService } from 'src/@sirio/domain/services/autorizacion/permiso.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';


@Component({
    selector: 'app-perfil-form',
    templateUrl: './perfil-form.component.html',
    styleUrls: ['./perfil-form.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class PerfilFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {


    @ViewChild('codigo') codigo: ElementRef;
    @ViewChild('nombre') nombre: ElementRef;

    treeControl: FlatTreeControl<Permiso>[] = [];

    perfil: Perfil = {} as Perfil;

    modulos = undefined;

    step = 0;
    disableExpanded = [];

    public dataSourceList: Permiso[] = [];

    private preSelecteds = new BehaviorSubject<Permiso[]>([]);

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    // flatNodeMap = new Map<TreeItemFlatNode, TreeItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    // nestedNodeMap = new Map<TreeItemNode, TreeItemFlatNode>();


    // dataSource: MatTreeFlatDataSource<TreeItemNode, TreeItemFlatNode>[] = [];


    constructor(
        dialog: MatDialog,
        injector: Injector,
        private fb: FormBuilder,
        private permisoService: PermisoService,
        private route: ActivatedRoute,
        private perfilService: PerfilService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector)
    }

    getLevel = (node: Permiso) => node.level;

    isExpandable = (node: Permiso) => {
        // console.log('is expandable ', node);

        return node.expandable;
    };

    hasChild = (_: number, _nodeData: Permiso) => _nodeData.expandable;


    private loadTree() {

        // this.treeFlattener = new MatTreeFlattener(
        //     this.transformer,
        //     this.getLevel,
        //     this.isExpandable,
        //     this.getChildren
        // );
        this.dataSourceList = [];


        // this.modulos = new BehaviorSubject<TreeItemFlatNode[]>([]);
        // this.initTree();
        this.permisoService.tree().subscribe(permisos => {
            // console.log(permisos);
            permisos.forEach(p => {
                if (!this.dataSourceList.filter(d => d.parent == undefined).map(d => d.id).includes(p.id) && p.parent == undefined) {
                    // console.log('add modulo ',p);

                    this.dataSourceList.push(p);

                    // this.dataSourceList.sort((a, b) => (a.ordination > b.ordination) ? 1 : -1);
                } else {
                    let modulo = this.dataSourceList.filter(d => d.id == p.parent || p.parent.startsWith(d.id));
                    // console.log('modulo', modulo);

                    if (modulo.length == 1) {
                        // console.log('add child modulo', modulo);
                        // agregando un hijo al modulo
                        p.level = p.parent ? p.parent.split('-').length : 0;
                        // p.expandable= p.parent?p.parent.split('-').length:0;
                        modulo[0].children = modulo[0].children || [];
                        modulo[0].children.push(p);
                        // buscar a mi padre y ponerlo expandable
                        let parent = modulo[0].children.find(pp => pp.id === p.parent);
                        // console.log('parent by ', p.id, parent);

                        // parent = parent || this.dataSourceList.find(pp=> pp.id==p.parent);
                        if (parent && !parent.expandable) {
                            // si me padre existe hago que este sea expandible
                            parent.expandable = true;
                        }
                    }
                }
            });
            this.loadwithPreselecteds();
            this.cdr.detectChanges();

        })
    }

    private loadwithPreselecteds() {
        /**
         * preseleccionar items
         */
        // console.log('tree data source', this.dataSourceList);

        this.dataSourceList.forEach((val, index) => {
            this.treeControl[index] = new FlatTreeControl<Permiso>(
                this.getLevel,
                this.isExpandable
            );


            this.treeControl[index].dataNodes = val.children;
        });


        this.preSelecteds.subscribe(pres => {

            if (!pres || pres.length == 0) {
                return;
            }

            // console.log(pres);



            this.dataSourceList.forEach((val, index) => {

                if (pres.map(p => p.id).includes(val.id)) {
                    val.checked = true;
                }
                // verifico si hay hijos preseleccionados
                if (val.children) {
                    val.children.forEach(c => {
                        if (pres.map(p => p.id).includes(c.id)) {
                            c.checked = true;
                        }
                    });

                }


            });


            // this.treeDataService.initializeWithPre(pres);


            // this.modulos.value.forEach((mod, index) => {
            //     const checked = pres.filter(el => el.id === mod.item).length > 0
            //     if (checked) {
            //         // console.log('mod checked ' + mod.item);
            //         this.modulos.value[index].checked = true;
            //         this.checklistSelection.select(mod);
            //     }
            //     //this.itemChecked(mod, checked);
            // });


            // this.treeControl.forEach(treeCtrl => {

            //     if (treeCtrl && treeCtrl.dataNodes) {

            //         for (let i = 0; i < treeCtrl.dataNodes.length; i++) {
            //             const node = treeCtrl.dataNodes[i];

            //             pres.forEach(el => {
            //                 if (el.id == node.item) {
            //                     // console.log('compare node ' + node.item + ' ' + el.id);

            //                     this.checklistSelection.select(node);
            //                     this.checkAllRootParentsSelection(node, treeCtrl);
            //                     // this.cdr.detectChanges()

            //                 }

            //             });


            //         }
            //     }
            // });
            this.cdr.detectChanges();
            // console.log('preseleccion ', this.checklistSelection);

        });



    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        // let tpl = this.route.snapshot.queryParams['t'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);



        this.loading$.subscribe(loaded => {
            if (!loaded) {

                this.eventFromElement(this.codigo, 'keyup')?.subscribe(() => {
                    // this.filterChange.emit(this.filter.nativeElement.value);
                    if (!this.f.id.errors && this.codigo.nativeElement.value.length > 4) {
                        this.codigoExists(this.codigo.nativeElement.value);
                    }
                });

                this.eventFromElement(this.codigo, 'keyup')?.subscribe(() => {
                    // this.filterChange.emit(this.filter.nativeElement.value);
                    if (!this.f.email.errors && this.codigo.nativeElement.value.length > 4) {
                        this.nameExists(this.codigo.nativeElement.value);
                    }
                });
            }

        });

        this.loadTree();


        if (id) {
            this.perfilService.get(id).subscribe((art: Perfil) => {
                this.perfil = art;

                this.buildForm();
                console.log('perfil ', this.perfil);
                
                this.preSelecteds.next(this.perfil.permisos);
                
                this.loadingDataForm.next(false);

                console.log('preseleecionados ', this.preSelecteds);


            }, err => {
                this.perfil = {} as Perfil
                this.loadingDataForm.next(false);
                this.buildForm();
                this.preSelecteds.next([]);
                //TODO: REVISAR ESTO LUEGO         this.router.navigate(['/autorizacion/perfiles']);

                //         this.snack.show({
                //             message: 'La Perfil solicitado no esta registrado!',
                //             verticalPosition: 'bottom',
                //             type: 'danger'
                //         });
            });
        } else {

            this.buildForm();
            this.loadingDataForm.next(false);
            this.preSelecteds.next([]);
        }

    }




    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {
            if (!loading) {
                console.log('cargado el arbol');

                this.cdr.detectChanges();
            }


        });

    }

    private buildForm() {

        this.itemForm = this.fb.group({
            id: new FormControl({ value: this.perfil.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC), Validators.maxLength(6)]),
            nombre: new FormControl(this.perfil.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            descripcion: new FormControl(this.perfil.descripcion, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
        });
    }


    // Función para actualizar la matriz de elementos
    updateTreeElements(element: Permiso, event, index) {


        element.checked = event.checked;
        // Obtener el elemento seleccionado y su padre
        let parentElement = this.dataSourceList[index].children?.find(e => e.id === element.parent);
        parentElement = parentElement || this.dataSourceList.find(e => e.id === element.parent);
        // console.log(' parent',parentElement);


        let descendants = this.treeControl[index].getDescendants(element);
        // console.log(descendants);

        element.checked
            ? descendants.forEach(p => { p.checked = true; return p; })
            : descendants.forEach(p => { p.checked = false; return p; });

        if (parentElement && parentElement.checked != event.checked) {
            const descendants = this.treeControl[index].getDescendants(parentElement);

            parentElement.checked = descendants.filter(p => p.checked == true).length > 0 || event.checked;

            // parentElement.checked=event.checked;
            if (descendants.length == 0 && parentElement.parent == undefined) {
                // console.log('parent desce 1', parentElement.children?.filter(c => c.checked));
                parentElement.checked = parentElement.children.filter(c => c.checked).length > 0 || event.checked;
            }
        }



        if (descendants.length == 0 && element.parent == undefined) {
            // puede que el node este fuera de este control
            this.dataSourceList[index].children?.forEach(n => n.checked = event.checked);
        }

        // busco padres desde los hijos hacia arriba en el arbol
        while (parentElement) {
            // mientras tenga padres sin checkear voy chequeandolos
            let parentId = parentElement.parent;

            parentElement = this.dataSourceList[index].children.find(e => e.id == parentId && e.checked != event.checked);
            if (!parentElement) {
                parentElement = this.dataSourceList.find(e => e.id == parentId && e.checked != event.checked);
            }

            if (parentElement && parentElement.checked != event.checked) {
                const descendants = this.treeControl[index].getDescendants(parentElement);
                parentElement.checked = descendants.filter(p => p.checked == true).length > 0 || event.checked;
                // console.log('parent desce 1', descendants);

                // revisar si algun padre quedo sin hijos checkeados y debo tambien deschearlo a el
                if (descendants.length == 0 && !parentElement.parent) {
                    // el parent no tiene decendientes
                    // tal vez este este en el dataSourceList y verifico que los hermano este al menos un chequedo, para no cambiar su estatus
                    // console.log('hermanos selected ',this.dataSourceList[index].children?.filter(p => p.checked == true));
                    // console.log('parent ',parentElement);


                    parentElement.checked = this.dataSourceList[index].children?.filter(p => p.checked == true).length > 0 || event.checked;
                }
            }


        }


        this.cdr.detectChanges();
    }


    // Función para obtener los elementos seleccionados
    private getSelectedElements() {

        let elements = [];

        elements = elements.concat(this.dataSourceList.filter(p => p.checked).map(p => p.id));
        // elements = elements.concat(this.dataSourceList.map(p=>p.children).filter(p=> p && p.filter(pp=>pp.checked)).map(p1=>p1.map(p2=>p2.id)));
        this.dataSourceList.forEach(element => {

            if (element.children) {
                elements = elements.concat(element.children.filter(p => p.checked).map(p => p.id));
            }

        });

        console.log('selecteds', elements);



        return elements;
    }

    public hasCheckedlements() {

        let hasChecked = false;

        this.dataSourceList.forEach(element => {
            if (element.checked) {
                hasChecked = true;
                return;
            }
        });


        return hasChecked;
    }

    save() {

        if (this.itemForm.invalid) {
            return;
        }

        this.updateData(this.perfil);
        this.perfil.permisos = [];


        this.perfil.permisos = this.getSelectedElements();


        console.log(this.perfil);


        this.saveOrUpdate(this.perfilService, this.perfil, 'El perfil')
        // this.checklistSelection.clear();

    }


    getLabel(item) {

        console.log(item);
        

        let label = `${item.label}`;

        try {
            label = label.indexOf('this.element.activo') >= 0 ? 'Activar/Inactivar' : 'action.'+label;

        } catch (error) {
            // no doing nothing
        }

        return label;
    }




    private codigoExists(id) {
        this.perfilService.exists(id).subscribe(data => {

            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    private nameExists(nombre) {
        this.perfilService.existsName(nombre).subscribe(data => {

            if (data.exists) {
                this.itemForm.controls['nombre'].setErrors({
                    existsName: "El nombre existe"
                });
                this.cdr.detectChanges();
            }
        });
    }



    setStep(index: number) {
        this.step = index;
        // console.log('step set '+index);


    }

}

