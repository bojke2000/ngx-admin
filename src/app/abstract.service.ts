import { HttpErrorResponse, HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Pageable } from './domain/pageable';
import { NgPrimeGridResponse } from './domain/ngprime-grid-response';

export abstract class AbstractService {

  prefix = 'http://localhost:8081/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    }),
  };

  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
   }


  get(url: string, pageable?: Pageable) {
    return this.http.get<any>(url.concat('?').concat(this.jsonToHttpParams(pageable)),  this.httpOptions)
      .toPromise()
      .then(res => <NgPrimeGridResponse>res);
  }

  jsonToHttpParams(json: any): string {
    let params = new HttpParams();
    for (const key in json) {
      if (key !== undefined) {
        params = params.set(key, json[key]);
      }
    }

    return params.toString();
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}

