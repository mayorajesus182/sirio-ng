
import { config } from "config";

export const environment = {
  production: true,
  api: {
    public: config.apiProUrl+'/api/public',
    default: config.apiProUrl+'/api',
    auth: config.apiProUrl+'/api',
    autorizacion: config.apiProUrl+'/api/autorizacion',
    comun: config.apiProUrl+'/api/comun',
    usuario: config.apiProUrl+'/api/usuario',
    resource: config.apiProUrl+'/api',
    websocket: config.apiProUrl+'/websocket',
    auditoria: config.apiProUrl+'/api/auditoria',
    reports: config.apiProUrl+'/api/reports',
    persona: config.apiProUrl+'/api/persona',
    configuracion: config.apiProUrl+'/api/configuracion',
    transporte: config.apiProUrl+'/api/transporte',
    workflow: config.apiProUrl+'/api/workflow',
    control_efectivo: config.apiProUrl+'/api/control-efectivo',
    organizacion: config.apiProUrl+'/api/organizacion',
    preferencia: config.apiProUrl+'/api/preferencia',
  }
};
