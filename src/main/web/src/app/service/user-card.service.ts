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
    let separator = '';

    if (searchCriteria.customerName) {
      url = url.concat('customerName==').concat('*').concat(searchCriteria.customerName).concat('*')
      separator = ';';
    }

    if (searchCriteria.customerId) {
      url = url.concat(separator).concat('customerId==').concat(searchCriteria.customerId);
      separator = ';';
    }

    if (searchCriteria.address) {
      url = url.concat(separator).concat('address==').concat('*').concat(searchCriteria.address).concat('*');
      separator = ';';
    }

    if (searchCriteria.usageCurrentFrom) {
      url = url.concat(separator).concat('usageCurrent>=').concat(searchCriteria.usageCurrentFrom);
      separator = ';';
    }

    if (searchCriteria.usageCurrentTo) {
      url = url.concat(separator).concat('usageCurrent<=').concat(searchCriteria.usageCurrentTo);
      separator = ';';
    }

    if (searchCriteria.usageReverseFrom) {
      url = url.concat(separator).concat('usageCurrentReverse>=').concat(searchCriteria.usageReverseFrom);
      separator = ';';
    }

    if (searchCriteria.usageReverseTo) {
      url = url.concat(separator).concat('usageCurrentReverse<=').concat(searchCriteria.usageReverseTo);
      separator = ';';
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
