import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export class TreeItemNode {
  children: TreeItemNode[];
  label: string;
  item: string;
  icon: string;
  descripcion?: string;
}

export class TreeItemFlatNode {
  item: string;
  label: string;
  descripcion?: string;
  icon?: string;
  level: number;
  checked:boolean;
  expandable: boolean;
}

@Injectable()
export class TreeDataService {
  dataChange = null;

  get data(): TreeItemNode[] {
    return this.dataChange.value;
  }

  constructor(private permisoService: PermisoService) {

  }

  initialize() {
    this.dataChange = new BehaviorSubject<TreeItemNode[]>([]);
    this.permisoService.tree().subscribe(tree => {

      const data = this.buildFileTree(tree, 0);
      // console.log('data tree ',data);
      this.dataChange.next(data);
    });
  }

  private buildFileTree(obj: Permiso[], level: number): TreeItemNode[] {
    return obj.reduce<TreeItemNode[]>((accumulator, item) => {
      const value = item;
      const node = new TreeItemNode();
      node.item = item.id;
      node.icon = item.icon;
      node.descripcion = item.descripcion;
      node.label = item.label;

      if (value != null) {
        if (value.subpermisos && value.subpermisos.length > 0) {
          node.children = this.buildFileTree(value.subpermisos, level + 1);
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  private buildFileTreeWithPre(obj: Permiso[], level: number,preselecteds:any[]): TreeItemNode[] {
    return obj.reduce<TreeItemNode[]>((accumulator, item) => {
      const value = item;

      if(!preselecteds.find(p => p.id == item.id)){
        return accumulator;
      }

      const node = new TreeItemNode();
      node.item = item.id;
      node.icon = item.icon;
      node.descripcion = item.descripcion;
      node.label = item.label;

      if (value != null ) {
        if (value.subpermisos && value.subpermisos.length > 0) {
          node.children = this.buildFileTreeWithPre(value.subpermisos, level + 1,preselecteds);
        }
      }

      return accumulator.concat(node);
    }, []);
  }


  public initOnlyChecked(preselecteds: any[]) {
    this.dataChange = new BehaviorSubject<TreeItemNode[]>([]);
    this.permisoService.tree().subscribe(tree => {


      const data = this.buildFileTreeWithPre(tree, 0,preselecteds);
      // Notify the change.
      this.dataChange.next(data);
    });

  }

  private filterTree(tree:Permiso[],){
    tree.forEach(element => {
      
    });
  }

}
