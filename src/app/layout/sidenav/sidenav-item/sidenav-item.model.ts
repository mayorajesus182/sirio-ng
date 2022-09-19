export interface MenuItem {
  label: string,      // Used as display text for item and title for separator type
  view?: string,     // Router state
  icon?: string,      // Material icon name
  color?: string,      // Material color
  type?: string,      // Material icon name
  tooltip?: string,   // Tooltip text 
  functionName?:string,
  section?:string,
  showInactive?:boolean;
  subpermisos?: MenuItem[];// Dropdown items
}
