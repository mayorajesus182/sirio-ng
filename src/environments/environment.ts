// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

import { config } from "config";

export const environment = {
  production: false,
  ssl:false,
  // googleMapsApiKey: '',
  // backend: 'http://localhost:4200' // Put your backend here

  api: {
    public: config.apiDevUrl+'/api/public',
    default: config.apiDevUrl+'/api',
    default_secure: config.apiDevUrl+'/api',
    websocket: config.apiSocketDev+'/wsocket',
    auth: config.apiDevUrl+'/api',
    autorizacion: config.apiDevUrl+'/api/autorizacion',
    comun: config.apiDevUrl+'/api/comun',
    usuario: config.apiDevUrl+'/api/usuario',
    resource: config.apiDevUrl+'/api',
    auditoria: config.apiDevUrl+'/api/auditoria',
    reports: config.apiDevUrl+'/api/reports',
    workflow: config.apiDevUrl+'/api/workflow',
    persona: config.apiProUrl+'/api/persona',
    configuracion: config.apiProUrl+'/api/configuracion',
    control_efectivo: config.apiProUrl+'/api/control-efectivo',
    gestion_comercial: config.apiProUrl+'/api/gestion-comercial',
    servicio: config.apiProUrl+'/api/servicio',
    organizacion: config.apiProUrl+'/api/organizacion',
    transporte: config.apiProUrl+'/api/transporte',
    preferencia: config.apiProUrl+'/api/preferencia',
    calendar: config.apiProUrl+'/api/calendar',
    pasivo: config.apiProUrl+'/api/pasivo',
    taquilla: config.apiProUrl+'/api/taquilla'
  }
};
