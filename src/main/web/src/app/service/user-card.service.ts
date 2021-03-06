import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractService } from '../abstract.service';
import { UserCard } from '../domain/user-card';
import { Pageable } from './../domain/pageable';

const CURRENT_VIEW = 1;
const URL_ALL = 1;

@Injectable()
export class UserCardService extends AbstractService {
  public static URL_ALL = 1;
  public static URL_PART_ONE = 2;
  public static URL_PART_TWO = 3;


  private url = this.prefix + 'user-cards';

  constructor(http: HttpClient) { super(http); }

  private toDate(date: Date, endDay: boolean = false): string {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;

    return [(dd > 9 ? '' : '0') + dd,
          '.',
          (mm > 9 ? '' : '0') + mm,
          '.',
          date.getFullYear(),
         ].join('');
  }

  findAll(pageable?: Pageable) {
    return this.get(this.url, pageable);
  }

  getUrl(baseUrl: string, searchCriteria: any, view: number): string {
    let url = baseUrl;
    let separator = '';

    if (searchCriteria.customerName) {
      const customerName = searchCriteria.customerName.trim().replace(' ', '*');
      url = url.concat('customerName==').concat('*').concat(customerName).concat('*');
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
      const re = / /gi;
      const address = searchCriteria.address.trim().replace(re, '*');
      url = url.concat(separator).concat('address=in=(').concat(address).concat(')');
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

    if (searchCriteria.deviceType !== undefined) {
      url = url.concat(separator).concat('deviceType==').concat(searchCriteria.deviceType);
      separator = ';';
    }

    if (view === UserCardService.URL_PART_ONE) {
      return url;
    } else if (view === UserCardService.URL_PART_TWO) {
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
      url = url.concat(separator).concat('readTimestamp>=').concat(this.toDate(searchCriteria.dateFrom));
      separator = ';';
    }

    if (searchCriteria.dateTo) {
      url = url.concat(separator).concat('readTimestamp<=').concat(this.toDate(searchCriteria.dateTo, true));
      separator = ';';
    }

    return url;
  }

  findBy(searchCriteria: any, pageable?: Pageable) {
    let url: string;
    if (!searchCriteria.dateTo && !searchCriteria.dateFrom) {
      url = this.getUrl(this.url.concat('?search='), searchCriteria, URL_ALL);
    } else {
      url = this.url.concat('/user-card/history');
      url = this.getUrl(url.concat('?search='), searchCriteria, UserCardService.URL_PART_ONE);
      url = url.concat('&').concat(this.getUrl('historySearch=', searchCriteria, UserCardService.URL_PART_TWO));
    }

    return this.get(url, pageable);

  }

  findSumBy(searchCriteria: any) {
    if (searchCriteria.displayType === CURRENT_VIEW) {
      return this.get(this.getUrl(this.url.concat('/summary?search='), searchCriteria, URL_ALL));
    }
  }

  findSummaries(searchCriteria: any, pageable?: Pageable) {
    if (searchCriteria.displayType === CURRENT_VIEW) {
      return this.get(this.getUrl(this.url.concat('/summaries?search='), searchCriteria, URL_ALL), pageable);
    }
  }

  reportBy(searchCriteria: any) {
    let url = this.url.concat('/report');;
    if (!searchCriteria.dateTo && !searchCriteria.dateFrom) {
      url = this.getUrl(url.concat('?search='), searchCriteria, URL_ALL);
    } else {
      url = this.getUrl(url.concat('?search='), searchCriteria, UserCardService.URL_PART_ONE);
      url = url.concat('&').concat(this.getUrl('historySearch=', searchCriteria, UserCardService.URL_PART_TWO));
    }

    return this.download(url);
  }

  getById(id: any) {
    return super.getById(this.url, id);
  }

  saveUser(userCard: UserCard): Observable<UserCard> {
    return userCard.id ? this.updateUser(userCard) : this.post(this.url, userCard);
  }

  updateUser(userCard: UserCard): Observable<UserCard> {
    return this.put(this.url, userCard);
  }

  deleteUserCard(userCard: UserCard): Observable<UserCard> {
    return super.delete(this.url, `${userCard.id}`);
  }
}
