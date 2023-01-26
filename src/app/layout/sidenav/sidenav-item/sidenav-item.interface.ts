export class SidenavItem {
  badge?: number;
  badgeColor?: string;
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
