export class GlobalConstants {
  public static IDLE_TIMEOUT = 15;
  public static TIMEOUT_IDLE = 60 * 15;
  public static APROBADO = 'APR';
  public static ANULADO = 'ANU';
  public static RECHAZADO = 'RCH';
  public static ACTIVADO = 'ACT';
  public static PREV_PAGE = 'prev_page';
  public static DATE_SHORT = 'DD/MM/YYYY';
  public static DATE_LONG = 'DD/MM/YYYY hh:mm:ss';

  public static PAIS_LOCAL = 'VEN';//TODO: EL PAIS VIENE DE PREFERENCIAS SE DEBE CAMBIAR 
  public static PATH_IMAGE_GCOMERCIAL = 'assets/img/demo/'; //TODO: GESTION COMERCIAL, DEBERIA SER UN PATH GLOBAL

  public static CHEQUE_FECHA_MINIMA = '365'; //TODO: ESTO DEBE ESTAR EN PREFERENCIAS
  public static CHEQUE_GERENCIA_FECHA_MINIMA = '180'; //TODO: ESTO DEBE ESTAR EN PREFERENCIAS
  public static CHEQUE = '90'; //TODO: ESTO DEBE ESTAR EN PREFERENCIAS
  public static CHEQUE_GERENCIA = '96'; //TODO: ESTO DEBE ESTAR EN PREFERENCIAS

  //TODO: REVISAR QUE ES ESTO
  public static TIPO_PERSONA = 'A';
  public static CUENTA_BANCO = 'J';
  public static BANCO = '0102';
  public static AGENCIA = '0126';

  //TODO: PERSONA
  public static TELEFONO_FIJO = 'F';
  public static TELEFONO_MOVIL = 'M';
  public static DIRECCION_PRINCIPAL = 'PR';
  public static PN_TIPO_DOC_MENOR = 'M';
  public static TIPDOC_GOBIERNO = 'G';
  public static TIPO_FIRMA_UNICA = '01';
  public static CASADO = 'CAS';
  public static UNION_ESTABLE = 'UDH';
  public static CURRENT_PERSON = 'current_person';
  public static PN_TIPO_DOC_DEFAULT = 'V';
  public static PJ_TIPO_DOC_DEFAULT = 'J';
  public static PERSONA_NATURAL = 'N';
  public static PERSONA_JURIDICA = 'J';


  // public static PERSON_TIPO_DOC_DEFAULT = 'V';
  // static CUENTA_BANCO: any;
  // public static ACTIVO = true;
};
