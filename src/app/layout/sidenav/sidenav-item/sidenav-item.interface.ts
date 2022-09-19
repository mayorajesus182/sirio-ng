export class SidenavItem {
  // name: string;
  // icon?: string;
  // routeOrFunction?: any;
  // subItems?: SidenavItem[];
  // position?: number;
  // badge?: string;
  // badgeColor?: string;
  // type?: 'item' | 'subheading';
  pathMatchExact?: boolean;
  customClass?: string;
  parent?: SidenavItem;
  label: string;
  view?: string;
  icon?: string;
  color?: string;
  type?: string;
  tooltip?: string;
  functionName?:string;
  section?:string;
  showInactive?:boolean;
  subpermisos?: SidenavItem[];// Dropdown items
}
