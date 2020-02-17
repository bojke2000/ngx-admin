import { HttpParams, HttpHeaders } from '@angular/common/http';

export abstract class AbstractService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
  };

  jsonToHttpParams(json: any): string {
    let params = new HttpParams();
    for (const key in json) {
      if (key !== undefined) {
        params = params.set(key, json[key]);
      }
    }

    return params.toString();
  }
}

