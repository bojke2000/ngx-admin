import { AbstractService } from '../abstract.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pageable } from './../domain/pageable';
import { UserCard } from '../domain/user-card';

const CURRENT_VIEW = 1;
const HISTORICAL_VIEW = 2;
const URL_ALL = 1;
const URL_PART_ONE = 2;
const URL_PART_TWO = 3;

@Injectable()
export class UserCardService extends AbstractService {

  private url = this.prefix + 'user-cards';

  constructor(http: HttpClient) { super(http); }

  findAll(pageable?: Pageable) {
    return this.get(this.url, pageable);
  }

  getUrl(baseUrl: string, searchCriteria: any, view: number) {
    let url = baseUrl;
    let separator = '';

    if (searchCriteria.customerName) {
      url = url.concat('customerName==').concat('*').concat(searchCriteria.customerName).concat('*')
      separator = ';';
    }

    if (searchCriteria.customerId) {
      url = url.concat(separator).concat('customerId=in=(').concat(searchCriteria.customerId).concat(')');
      separator = ';';
    }

    if (searchCriteria.deviceId) {
      url = url.concat(separator).concat('deviceId=in=(').concat(searchCriteria.deviceId).concat(')');
      separator = ';';
    }

    if (searchCriteria.gsmId) {
      url = url.concat(separator).concat('gsmId=in=(').concat(searchCriteria.gsmId).concat(')');
      separator = ';';
    }

    if (searchCriteria.address) {
      url = url.concat(separator).concat('address==').concat('*').concat(searchCriteria.address).concat('*');
      separator = ';';
    }

    if (searchCriteria.readingBook) {
      url = url.concat(separator).concat('readingBook=in=(').concat(searchCriteria.readingBook).concat(')');
      separator = ';';
    }

    if (searchCriteria.municipality) {
      url = url.concat(separator).concat('municipality=in=(').concat(searchCriteria.municipality).concat(')');
      separator = ';';
    }

    if (searchCriteria.route) {
      url = url.concat(separator).concat('route=in=(').concat(searchCriteria.route).concat(')');
      separator = ';';
    }

    if (view === URL_PART_ONE) {
      return url;
    } else if (view === URL_PART_TWO) {
      url = baseUrl;
      separator = '';
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

    if (searchCriteria.dateFrom) {
      url = url.concat(separator).concat('dateFrom<=').concat(searchCriteria.dateFrom);
      separator = ';';
    }

    if (searchCriteria.dateTo) {
      url = url.concat(separator).concat('dateTo>=').concat(searchCriteria.dateTo);
      separator = ';';
    }

    return url;
  }

  findBy(searchCriteria: any, pageable?: Pageable) {
    if (searchCriteria.displayType === CURRENT_VIEW) {
      return this.get(this.getUrl(this.url.concat('?search='), searchCriteria, URL_ALL), pageable);
    } else if (searchCriteria.displayType === HISTORICAL_VIEW) {
      let url = this.url.concat("/history");
      url = this.getUrl(url.concat('?search='),searchCriteria, URL_PART_ONE);
      url = url.concat("&").concat(this.getUrl('historySearch=', searchCriteria, URL_PART_TWO));

      return this.get(url,pageable);
    }
  }

  getById(id: any) {
    return super.getById(this.url, id);
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
