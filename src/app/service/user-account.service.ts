import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AbstractService } from '../abstract.service';
import { NgPrimeGridResponse } from '../domain/ngprime-grid-response';
import { Pageable } from '../domain/pageable';
import { UserAccount } from '../domain/user-account';

@Injectable()
export class UserAccountService extends AbstractService {

    private url = 'http://localhost:8081/user-accounts';

    constructor(private http: HttpClient) {
      super();
     }

    getUserAccounts(pageable?: Pageable) {
      return this.http.get<any>(this.url.concat('?').concat(this.jsonToHttpParams(pageable)))
        .toPromise()
        .then(res => <NgPrimeGridResponse>res);
    }

    searchUserAccounts(query: string, pageable?: Pageable) {
      const uri = this.url.concat('?search=username==').concat(query)
      .concat('*,email==*').concat(query).concat('*').concat('&').concat(this.jsonToHttpParams(pageable));
      return this.http.get<any>(uri)
        .toPromise()
        .then(res => <NgPrimeGridResponse>res);
    }

    addUserAccount (userAccount: UserAccount): Observable<UserAccount> {
      return this.http.post<UserAccount>(this.url, userAccount, this.httpOptions)
        .pipe(catchError(this.handleError));
    }

    updateUserAccount (userAccount: UserAccount): Observable<UserAccount> {
      return this.http.put<UserAccount>(this.url, userAccount, this.httpOptions)
        .pipe(catchError(this.handleError));
    }

    deleteUserAccount (userAccount: UserAccount): Observable<UserAccount> {
      const url = `${this.url}/${userAccount.id}`; // DELETE api/heroes/42
      return this.http.delete<UserAccount>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
    }
}
