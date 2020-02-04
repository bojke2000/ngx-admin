import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserAccountTypesService {

    constructor(private http: HttpClient) { }

    getUserAccountTypes() {
     return this.http.get<any>('http://localhost:8081/user-account-types')
      .toPromise()
      .then(res =>  <string[]>res.data)
      .then(data => data.map( (el) => ({label: el, value: el}))).then(res => res);
    }
}
