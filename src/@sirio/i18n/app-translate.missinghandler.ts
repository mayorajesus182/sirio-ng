import { MissingTranslationHandler, MissingTranslationHandlerParams } from "@ngx-translate/core";

export class AppTranslateMissingHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    // throw new Error("Method not implemented.");
    // const tl = params.translateService;
    
    if (params.interpolateParams ) {
      return !params.interpolateParams["default"]? '- not found value default -' : params.interpolateParams["default"];
    }
    return params.key;
  }

} 