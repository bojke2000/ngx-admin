import { AbstractService } from '../abstract.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable } from '../domain/pageable';

@Injectable()
export class UsageHistoryService extends AbstractService {

  private url = this.prefix + 'usage-history';

  constructor(http: HttpClient) { super(http); }

  getCharData(userCardId?: number) {
    const url = this.url + "/chart-data" + "?userCardId=" + userCardId;
    return this.get(url);
  }

  getUrl(baseUrl: string, searchCriteria: any) {
    let url = baseUrl;
    let separator = '';

    if (searchCriteria.userCardId) {
      url = url.concat('userCardId==').concat(searchCriteria.userCardId);
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
      return this.get(this.getUrl(this.url.concat('?search='), searchCriteria), pageable);
  }
}
