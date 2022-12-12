export class SidenavItem {
  // name: string;
  // icon?: string;
  // routeOrFunction?: any;
  // subItems?: SidenavItem[];
  // position?: number;
  badge?: number;
  badgeColor?: string;
  // type?: 'item' | 'subheading';
  id?: string;
  pathMatchExact?: boolean;
  customClass?: string;
  parent?: SidenavItem;
  label: string;
  view?: string;
  icon?: string;
  color?: string;
  type?: 'item' | 'subheading';
  tooltip?: string;
  functionName?:string;
  section?:string;
  showInactive?:boolean;
  subpermisos?: SidenavItem[];// Dropdown items
}
