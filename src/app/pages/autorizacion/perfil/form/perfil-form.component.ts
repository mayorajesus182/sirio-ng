import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { genialBetAnimations } from 'app/shared/animations';
import PerfectScrollbar from 'perfect-scrollbar';
import { FormBaseComponent } from '../../../../shared/components/base/form-base.component';
import { Perfil, PerfilService, Plantilla } from 'app/shared/domain/services/autorizacion/perfil.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { TreeDataService, TreeItemFlatNode, TreeItemNode } from './tree-data.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { RegularExpConstants } from 'app/shared/constants/regularexp.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { SweetAlertService } from 'app/shared/services/swal.service';
import { Permiso } from 'app/shared/domain/services/autorizacion/permiso.service';


@Component({
    selector: 'app-perfil-form',
    templateUrl: './perfil-form.component.html',
    styleUrls: ['./perfil-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: genialBetAnimations
})

export class PerfilFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    perfil: Perfil = {} as Perfil;
    plantilla: Plantilla = undefined;


    a: PerfectScrollbar;

    modulos = undefined;

    step = 0;
    disableExpanded = [];

    public dataSourceArray = [{}];

    private preSelecteds = new BehaviorSubject<Permiso[]>([]);

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TreeItemFlatNode, TreeItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TreeItemNode, TreeItemFlatNode>();

    treeControl: FlatTreeControl<TreeItemFlatNode>[] = [];

    treeFlattener: MatTreeFlattener<TreeItemNode, TreeItemFlatNode>;

    dataSource: MatTreeFlatDataSource<TreeItemNode, TreeItemFlatNode>[] = [];

    checklistSelection = new SelectionModel<TreeItemFlatNode>(
        true /* multiple */
    );

    constructor(
        dialog: MatDialog,
        private fb: FormBuilder,
        snack: SnackbarService,
        private route: ActivatedRoute,
        private perfilService: PerfilService,
        private cdr: ChangeDetectorRef,
        spinner: NgxSpinnerService,
        swal: SweetAlertService,
        protected router: Router,
        public treeDataService: TreeDataService) {
        super(dialog, snack, spinner, swal)
    }

    private loadTree(){

        this.treeFlattener = new MatTreeFlattener(
            this.transformer,
            this.getLevel,
            this.isExpandable,
            this.getChildren
        );

        this.treeDataService.initialize();

        this.modulos = new BehaviorSubject<TreeItemFlatNode[]>([]);
        this.initTree();

        this.loadPreselecteds();
    }

    private loadPreselecteds() {
        /**
         * preseleccionar items, dado la plantilla
         */

        this.preSelecteds.subscribe(pres => {

            // console.log('preselecciones ', pres);
            if (!pres || pres.length == 0) {
                return;
            }




            this.modulos.value.forEach((mod, index) => {
                const checked = pres.filter(el => el.id === mod.item).length > 0
                if (checked) {
                    // console.log('mod checked ' + mod.item);
                    this.modulos.value[index].checked = true;
                    this.checklistSelection.select(mod);
                }
                //this.itemChecked(mod, checked);
            });


            this.treeControl.forEach(treeCtrl => {

                if (treeCtrl && treeCtrl.dataNodes) {

                    for (let i = 0; i < treeCtrl.dataNodes.length; i++) {
                        const node = treeCtrl.dataNodes[i];

                        pres.forEach(el => {
                            if (el.id == node.item) {
                                // console.log('compare node ' + node.item + ' ' + el.id);

                                this.checklistSelection.select(node);
                                this.checkAllRootParentsSelection(node, treeCtrl);
                                // this.cdr.markForCheck()

                            }

                        });


                    }
                }
            });
            this.cdr.markForCheck();
            // console.log('preseleccion ', this.checklistSelection);

        });



    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        let tpl = this.route.snapshot.queryParams['t'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);



        this.loading$.subscribe(loaded => {
            if (!loaded) {

                this.f.id.valueChanges.subscribe(value => {

                    if (!this.f.id.errors) {
                        this.codigoExists(value);
                    }
                });

                this.f.nombre.valueChanges.subscribe(value => {
                    if (!this.f.nombre.errors) {
                        this.nameExists(value);
                    }
                });
            }

        });

        this.loadTree();


        if (tpl) {

            this.perfilService.getPlantilla(tpl).subscribe((tpl: Plantilla) => {
                this.plantilla = tpl;
                console.log('template ', tpl);
                
                // cargar preseleccionados cuando vengo de una plantilla
                this.preSelecteds.next(this.plantilla.permisos);
                // this.loadPreselecteds();

                // this.initTree();
                this.cdr.markForCheck();

                // this.custom_title = data.titulo;

            });

        }

        if (id) {
            this.perfilService.get(id).subscribe((art: Perfil) => {
                this.perfil = art;
                
                this.buildItemForm(this.perfil);
                console.log('perfil ', this.perfil);
                // cargar preseleccionados desde el modo edicion   
                this.preSelecteds.next(this.perfil.permisos);
                // this.loadPreselecteds();

                // this.initTree();


                // console.log('preseleecionados ', this.preSelecteds);

                this.cdr.markForCheck();
                this.loadingDataForm.next(false);

            }, err => {

                this.loadingDataForm.next(false);
                this.router.navigate(['/autorizacion/perfiles']);

                this.snack.show({
                    message: 'La Perfil solicitado no esta registrado!',
                    verticalPosition: 'bottom',
                    type: 'danger'
                });
            });
        } else {
            
            this.buildItemForm(this.perfil);
            this.loadingDataForm.next(false);

            if (!tpl) {
                console.log('init tree sin template');
                // this.initTree();
            }
        }

    }

    private initTree() {


        this.treeDataService.dataChange.subscribe(data => {

            if (data.length == 0) {
                return;
            }
            // console.log('data tree ',data);

            data.forEach((element, index) => {

                this.treeControl[index] = new FlatTreeControl<TreeItemFlatNode>(
                    this.getLevel,
                    this.isExpandable
                );

                this.dataSource[index] = new MatTreeFlatDataSource(
                    this.treeControl[index],
                    this.treeFlattener
                );

                if (element.children) {
                    this.modulos.value.push(this.transformer(element, 0));
                    this.dataSource[index].data = element.children;
                }


            });

            // console.log(this.modulos);

            this.cdr.markForCheck();
        });
    }


    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {
            if (!loading) {
                console.log('cargado el arbol');

                this.cdr.markForCheck();
            }


        });

    }

    private buildItemForm(item: Perfil) {

        this.itemForm = this.fb.group({
            id: new FormControl({ value: item.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC),Validators.maxLength(6)]),
            nombre: new FormControl(item.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHANUMERIC_ACCENTS_CHARACTERS)]),
            descripcion: new FormControl(item.descripcion, [Validators.required, Validators.pattern(RegularExpConstants.ALPHANUMERIC_ACCENTS_CHARACTERS)]),
        });
    }

    // save() {
    //     if (this.itemForm.invalid)
    //         return;
    //     this.updateData(this.perfil);

    //     // console.log(this.perfil);


    //     this.saveOrUpdate(this.perfilService, this.perfil, 'El Perfil', this.isNew);
    //     // this.todoService.updateTodo(this.todo).subscribe(res => {
    //     //   this.router.navigateByUrl("/todo/list");
    //     // });

    // }

    save() {

        if (this.itemForm.invalid) {
            return;
        }

        this.updateData(this.perfil);
        this.perfil.permisos = [];



        console.log('Elementos seleccionados', this.checklistSelection.selected);


        this.checklistSelection.selected.forEach(element => {

            this.perfil.permisos.push({
                'id': element.item,
            })

        });


        console.log(this.perfil);


        this.saveOrUpdate(this.perfilService, this.perfil, 'El perfil', this.isNew).subscribe(result => {
            console.log('result', result);
            this.perfil = {} as Perfil;
        });

        this.checklistSelection.clear();

    }


    getLabel(item) {

        let label = `${item.label}`;

        try {
            label = label.indexOf('this.element.activo') >= 0 ? 'Activar/Inactivar' : label;

        } catch (error) {
            // no doing nothing
        }

        return label;
    }

    getLevel = (node: TreeItemFlatNode) => node.level;

    isExpandable = (node: TreeItemFlatNode) => node.expandable;

    getChildren = (node: TreeItemNode): TreeItemNode[] => node.children;

    hasChild = (_: number, _nodeData: TreeItemFlatNode) => _nodeData.expandable;

    parentIs = (_: number, _nodeData: TreeItemFlatNode) => {
        if (_nodeData.item === this.treeDataService.data[this.step].item) {
            return _nodeData;
        }
    };

    transformer = (node: TreeItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode =
            existingNode && existingNode.item === node.item
                ? existingNode
                : new TreeItemFlatNode();
        flatNode.item = node.item;
        flatNode.level = level;
        flatNode.label = node.label;
        flatNode.icon = node.icon;
        flatNode.descripcion = node.descripcion;
        flatNode.expandable = !!node.children;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    };

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TreeItemFlatNode): boolean {
        const descendants = this.treeControl[this.step].getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        // console.log('descendants all checked',descAllSelected);

        return descAllSelected;
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TreeItemFlatNode): boolean {

        // console.log('node descendants ',node);

        const descendants = this.treeControl[this.step].getDescendants(node);
        // console.log('descendants ',descendants);

        const result = descendants.some(child =>
            this.checklistSelection.isSelected(child)
        );
        return result && !this.descendantsAllSelected(node);
    }


    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    itemSelectionToggle(node: TreeItemFlatNode): void {
        // console.log(this.treeControl[this.step].dataNodes);
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl[this.step].getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.every(child => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);
        console.log('Node: ', node);
        console.log('Modulo step index', this.modulos.value[this.step]);

        if (this.checklistSelection.isSelected(node) && !this.modulos.value[this.step].checked) {
            console.log('select node parent module');
            this.modulos.value[this.step].checked = true;
            this.checklistSelection.select(this.modulos.value[this.step]);
            this.cdr.markForCheck();
        } else if (!this.checklistSelection.isSelected(node) && !this.hasBrothersChecked(node)) {
            this.modulos.value[this.step].checked = false;
            this.checklistSelection.deselect(this.modulos.value[this.step]);
            this.cdr.markForCheck();
        }


        // this.cdr.detectChanges();
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    leafItemSelectionToggle(node: TreeItemFlatNode): void {
        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);

        if (!this.checklistSelection.isSelected(node) && !this.hasBrothersChecked(node)) {
            // mantener al modulo checked porque tiene castigo hijos checked
            console.log('unchecked modulo ', this.modulos.value[this.step]);
            this.modulos.value[this.step].checked = false;
            this.checklistSelection.deselect(this.modulos.value[this.step]);
            this.cdr.markForCheck();
        } else if (this.checklistSelection.isSelected(node) && !this.modulos.value[this.step].checked) {
            this.modulos.value[this.step].checked = true;
            this.checklistSelection.select(this.modulos.value[this.step]);
            this.cdr.markForCheck();
        }
        // this.cdr.detectChanges();
    }

    private itemChecked(node: TreeItemFlatNode, status): void {
        // console.log(this.treeControl);
        status ? this.checklistSelection.select(node) : this.checklistSelection.deselect(node);
        const descendants = this.treeControl[this.step].getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.every(child => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);
    }


    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: TreeItemFlatNode): void {
        let parent: TreeItemFlatNode | null = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }

    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: TreeItemFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl[this.step].getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected) {// && descAllSelected
            this.checklistSelection.select(node);
        }
    }


    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllRootParentsSelection(node: TreeItemFlatNode, treeControl): void {
        let parent: TreeItemFlatNode | null = this.getParentNodeFromTreeCtrl(node, treeControl);
        while (parent) {
            const nodeSelected = this.checklistSelection.isSelected(parent);
            if (!nodeSelected) {// && descAllSelected
                this.checklistSelection.select(parent);
            }
            parent = this.getParentNodeFromTreeCtrl(parent, treeControl);
        }

    }

    /* Get the parent node of a node */
    getParentNodeFromTreeCtrl(node: TreeItemFlatNode, treeControl): TreeItemFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }
    /* Get the parent node of a node */
    getParentNode(node: TreeItemFlatNode): TreeItemFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl[this.step].dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl[this.step].dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    private hasBrothersChecked(node: TreeItemFlatNode) {
        const currentLevel = this.getLevel(node);

        for (let i = 0; i < this.treeControl[this.step].dataNodes.length; i++) {
            const currentNode = this.treeControl[this.step].dataNodes[i];

            if (this.getLevel(currentNode) == currentLevel) {
                if (this.checklistSelection.isSelected(currentNode) || this.descendantsPartiallySelected(currentNode)) {
                    return true;
                }
            }
        }

        return false;
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

    checkAll(index: number, event) {

        if (index == undefined) {
            return;
        }

        if (!this.treeControl[index].dataNodes) {
            return;
        }

        this.modulos.value[index].checked = event.checked;
        let checkedMod = this.modulos.value[index].checked || false;

        console.log('checked mod ', event)
        // this.checklistSelection.deselect(this.modulos.value[index])
        console.log('checklist', this.checklistSelection);


        if (this.modulos.value[index].checked) {
            console.log('seleccionando module');
            this.checklistSelection.select(this.modulos.value[index]);
            // this.modulos.value[index].checked=true;
            // checkedMod=true;
        } else if (!this.modulos.value[index].checked) {
            console.log('deseleccionar module');
            this.checklistSelection.deselect(this.modulos.value[index]);
            // this.modulos.value[index].checked=false;
        }

        for (let i = 0; i < this.treeControl[index].dataNodes.length; i++) {
            const currentNode = this.treeControl[index].dataNodes[i];

            if (checkedMod && !this.checklistSelection.isSelected(currentNode)) {

                this.checklistSelection.select(currentNode);
                // console.log('node current', currentNode);
            } else if (!checkedMod && this.checklistSelection.isSelected(currentNode)) {
                this.checklistSelection.deselect(currentNode);
                // this.checklistSelection.select(this.modulos.value[index]);
            }


        }

        this.cdr.markForCheck();

    }

    captureEvent(evt) {
        console.log('event capture ', evt);

    }
}
