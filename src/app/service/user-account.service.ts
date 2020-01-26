import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAccount } from '../domain/user-account';

@Injectable()
export class UserAccountService {

    constructor(private http: HttpClient) { }

    getAccounts() {
    return this.http.get<any>('http://localhost:8081/user-accounts')
      .toPromise()
      .then(res => <UserAccount[]>res.data)
      .then(data => data);
    };

    getUserAccounts() {
      return this.http.get<any>('assets/showcase/data/user-accounts.json')
        .toPromise()
        .then(res => <UserAccount[]>res.data)
        .then(data => data);
    };
}
