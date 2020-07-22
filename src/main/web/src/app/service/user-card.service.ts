import { AbstractService } from '../abstract.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pageable } from './../domain/pageable';
import { UserCard } from '../domain/user-card';

@Injectable()
export class UserCardService extends AbstractService {

  private url = this.prefix + 'user-cards';

  constructor(http: HttpClient) { super(http); }

  findAll(pageable?: Pageable) {
    return this.get(this.url, pageable);
  }

  findBy(searchCriteria: any, pageable?: Pageable) {
    let url = this.url.concat('?search=');
    if (searchCriteria.customerName) {
      url = url.concat('customerName==').concat('*').concat(searchCriteria.customerName).concat('*')
    }

    return this.get(url, pageable);
  }

  saveUser(userCard: UserCard): Observable<UserCard> {
    return this.post(this.url, userCard);
  }

  updateUser(userCard: UserCard): Observable<UserCard> {
    return this.put(this.url, userCard);
  }

  deleteUserCard(userCard: UserCard): Observable<UserCard> {
    return super.delete(this.url, `${userCard.id}`);
  }
}
