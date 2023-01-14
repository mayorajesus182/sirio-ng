
import { config } from "config";

export const environment = {
  production: true,
  api: {
    public: config.apiProUrl+'/api/public',
    default: config.apiProUrl+'/api',
    default_secure: config.apiDevUrl+'/api',
    websocket: config.apiSocketPro+'/wsocket',
    calendar: config.apiProUrl+'/api/calendar',
    auth: config.apiProUrl+'/api',
    autorizacion: config.apiProUrl+'/api/autorizacion',
    comun: config.apiProUrl+'/api/comun',
    usuario: config.apiProUrl+'/api/usuario',
    resource: config.apiProUrl+'/api',
    auditoria: config.apiProUrl+'/api/auditoria',
    reports: config.apiProUrl+'/api/reports',
    persona: config.apiProUrl+'/api/persona',
    configuracion: config.apiProUrl+'/api/configuracion',
    transporte: config.apiProUrl+'/api/transporte',
    workflow: config.apiProUrl+'/api/workflow',
    control_efectivo: config.apiProUrl+'/api/control-efectivo',
    gestion_comercial: config.apiProUrl+'/api/gestion-comercial',
    organizacion: config.apiProUrl+'/api/organizacion',
    preferencia: config.apiProUrl+'/api/preferencia',
    pasivo: config.apiProUrl+'/api/pasivo',
    taquilla: config.apiProUrl+'/api/taquilla',

  }
};
