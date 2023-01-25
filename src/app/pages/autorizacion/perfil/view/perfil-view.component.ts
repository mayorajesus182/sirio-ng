
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Perfil, PerfilService } from 'src/@sirio/domain/services/autorizacion/perfil.service';
import { Permiso } from 'src/@sirio/domain/services/autorizacion/permiso.service';
import { TreeDataService, TreeItemFlatNode, TreeItemNode } from 'src/@sirio/domain/services/autorizacion/tree-data.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';


@Component({
  selector: 'app-perfil-view',
  templateUrl: './perfil-view.component.html',
  styleUrls:['./perfil-view.component.scss'],  
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})
export class PerfilViewComponent extends FormBaseComponent implements OnInit {

  perfil: Perfil = {} as Perfil;

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


  modulos = null;
  step = 0;

  constructor(
    injector: Injector,
    private route: ActivatedRoute,
    private perfilService: PerfilService,
    private cdr: ChangeDetectorRef,
    public treeDataService: TreeDataService) {

    super(undefined, injector);

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

    this.loadingDataForm.next(true);


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

    if (id) {
      this.perfilService.get(id).subscribe((art: Perfil) => {
        this.perfil = art;
        console.log('perfil ', this.perfil);
        // cargar preseleccionados desde el modo edicion   
        this.preSelecteds.next(this.perfil.permisos);
        // this.loadPreselecteds();

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
      // regresar a la pantalla de lista
      this.router.navigate(['/autorizacion/perfiles']);
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


  get d() {
    return this.perfil;
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
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TreeItemFlatNode): boolean {
    const descendants = this.treeControl[this.step].getDescendants(node);
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
    if (this.checklistSelection.isSelected(node) && !this.checklistSelection.isSelected(this.modulos.value[this.step])) {
      this.checklistSelection.select(this.modulos.value[this.step]);
    }

    if (!this.checklistSelection.isSelected(node) && !this.hasBrothersChecked(node)) {

      this.checklistSelection.deselect(this.modulos.value[this.step]);
    }
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  leafItemSelectionToggle(node: TreeItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);

    if (!this.checklistSelection.isSelected(node) && !this.hasBrothersChecked(node)) {

      this.checklistSelection.deselect(this.modulos.value[this.step]);
    }
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


  setStep(index: number) {
    this.step = index;

  }



}