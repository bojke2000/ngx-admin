import { HttpParams } from '@angular/common/http';

export abstract class AbstractService {

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

