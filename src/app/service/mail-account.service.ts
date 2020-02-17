import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MailAccount } from '../domain/mail-account';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pageable } from '../domain/pageable';
import { AbstractService } from '../abstract.service';
import { NgPrimeGridResponse } from '../domain/ngprime-grid-response';

@Injectable()
export class MailAccountService extends AbstractService {

    private mailAccountUrl = 'http://localhost:8081/mail-accounts';
    private mailFetchUrl = 'http://localhost:8081/mail-fetch';

    constructor(private http: HttpClient) {
      super();
     }

    getMailAccounts(pageable?: Pageable) {
      return this.http.get<any>(this.mailAccountUrl.concat('?').concat(this.jsonToHttpParams(pageable)))
        .toPromise()
        .then(res => <NgPrimeGridResponse>res);
    }

    searchMailAccounts(query: string, pageable?: Pageable) {
      const uri = this.mailAccountUrl.concat('?search=account==').concat(query)
      .concat('*,server==*').concat(query).concat('*').concat('&').concat(this.jsonToHttpParams(pageable));
      return this.http.get<any>(uri)
        .toPromise()
        .then(res => <NgPrimeGridResponse>res);
    }

    addMailAccount (mailAccount: MailAccount): Observable<MailAccount> {
      return this.http.post<MailAccount>(this.mailAccountUrl, mailAccount, this.httpOptions)
        .pipe(catchError(this.handleError));
    }

    updateMailAccount (mailAccount: MailAccount): Observable<MailAccount> {
      return this.http.put<MailAccount>(this.mailAccountUrl, mailAccount, this.httpOptions)
        .pipe(catchError(this.handleError));
    }

    deleteMailAccount (mailAccount: MailAccount): Observable<MailAccount> {
      const url = `${this.mailAccountUrl}/${mailAccount.id}`; // DELETE api/heroes/42
      return this.http.delete<MailAccount>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
    }

    fetchDataFromServer (mailAccount: MailAccount): Observable<MailAccount> {
      const url = `${this.mailFetchUrl}/${mailAccount.id}`; // DELETE api/heroes/42
      return this.http.get<MailAccount>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
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
