import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAccount } from '../domain/user-account';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pageable } from '../domain/pageable';
import { AbstractService } from '../abstract.service';
import { NgPrimeGridResponse } from '../domain/ngprime-grid-response';

@Injectable()
export class UserAccountService extends AbstractService {

    private userAccountUrl = 'http://localhost:8081/user-accounts';

    constructor(private http: HttpClient) {
      super();
     }

    getUserAccounts(pageable?: Pageable) {
      return this.http.get<any>(this.userAccountUrl.concat('?').concat(this.jsonToHttpParams(pageable)))
        .toPromise()
        .then(res => <NgPrimeGridResponse>res);
    }

    searchUserAccounts(query: string, pageable?: Pageable) {
      const uri = this.userAccountUrl.concat('?search=username==').concat(query)
      .concat('*,email==*').concat(query).concat('*').concat('&').concat(this.jsonToHttpParams(pageable));
      return this.http.get<any>(uri)
        .toPromise()
        .then(res => <NgPrimeGridResponse>res);
    }

    addUserAccount (userAccount: UserAccount): Observable<UserAccount> {
      return this.http.post<UserAccount>(this.userAccountUrl, userAccount, this.httpOptions)
        .pipe(catchError(this.handleError));
    }

    updateUserAccount (userAccount: UserAccount): Observable<UserAccount> {
      return this.http.put<UserAccount>(this.userAccountUrl, userAccount, this.httpOptions)
        .pipe(catchError(this.handleError));
    }

    deleteUserAccount (userAccount: UserAccount): Observable<UserAccount> {
      const url = `${this.userAccountUrl}/${userAccount.id}`; // DELETE api/heroes/42
      return this.http.delete<UserAccount>(url, this.httpOptions)
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

    getTestAccounts() {
      return this.http.get<any>('assets/showcase/data/user-accounts.json')
        .toPromise()
        .then(res => <UserAccount[]>res.data)
        .then(data => data);
    }
}
