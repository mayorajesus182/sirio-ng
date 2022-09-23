// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

import { config } from "config";

export const environment = {
  production: false,
  // googleMapsApiKey: '',
  // backend: 'http://localhost:4200' // Put your backend here

  api: {
    public: config.apiDevUrl+'/api/public',
    default: config.apiDevUrl+'/api',
    default_secure: config.apiDevUrl+'/api',
    auth: config.apiDevUrl+'/api',
    autorizacion: config.apiDevUrl+'/api/autorizacion',
    comun: config.apiDevUrl+'/api/comun',
    usuario: config.apiDevUrl+'/api/usuario',
    resource: config.apiDevUrl+'/api',
    websocket: config.apiDevUrl+'/websocket',
    auditoria: config.apiDevUrl+'/api/auditoria',
    reports: config.apiDevUrl+'/api/reports',
    persona: config.apiProUrl+'/api/persona',
    configuracion: config.apiProUrl+'/api/configuracion',
    organizacion: config.apiProUrl+'/api/organizacion',
    preferencia: config.apiProUrl+'/api/preferencia',
  }
};
