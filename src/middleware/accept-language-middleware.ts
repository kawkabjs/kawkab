import { request, trans } from '..';

export class AcceptLanguageMiddleware {
  constructor(detect:boolean=false){
    if(detect && request.wantsJson() && request.header('Accept-Language')){
      trans.setLocale(request.header('Accept-Language'));
    }else{
      trans.setLocale(trans.getDefaultLocale());
    }
  }
}