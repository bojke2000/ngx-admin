import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { UserCard } from '../domain/user-card';

@Injectable()
export class UserCardService extends AbstractService {

  private url = this.prefix + 'user-cards';

  constructor(private http: HttpClient) { super(); }

  getUserCards() {
    return this.http.get<any>(this.url, this.httpOptions)
      .toPromise()
      .then(res => <UserCard[]>res.data)
      .then(data => data);
  }
}
