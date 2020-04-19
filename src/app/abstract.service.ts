import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Pageable } from './domain/pageable';

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


  protected get(url: string, pageable?: Pageable) {
    const symbol = url.indexOf('?') > 0 ? '&' : '?';
    return this.http.get(url.concat(symbol).concat(this.jsonToHttpParams(pageable)),  this.httpOptions)
      .toPromise()
      .then(res => res);
  }

  protected post<T>(url: string, form: any): Observable<T> {
    return this.http.post<T>(url, form, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  protected put<T>(url: string, form: any): Observable<T> {
    return this.http.put<T>(url, form, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  protected delete<T>(url: string, id: string): Observable<T> {
    const postUrl = `${url}/${id}`; // DELETE api/heroes/42
    return this.http.delete<T>(postUrl, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  protected jsonToHttpParams(json: any): string {
    let params = new HttpParams();
    for (const key in json) {
      if (key !== undefined) {
        params = params.set(key, json[key]);
      }
    }

    return params.toString();
  }

  protected _upload(url: string, formData: FormData) {
    const myHttpOptions = { headers: new HttpHeaders({})};

    return this.http.post<any>(`${url}/upload`, formData, myHttpOptions)
      .toPromise()
      .then(data => data);
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

