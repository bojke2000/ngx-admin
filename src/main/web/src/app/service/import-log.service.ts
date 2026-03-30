import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../abstract.service';
import { ImportLog } from '../domain/import-log';
import { NgPrimeGridResponse } from '../domain/ngprime-grid-response';
import { Pageable } from '../domain/pageable';

@Injectable()
export class ImportLogService extends AbstractService {

  private url = this.prefix + 'import-logs';

  constructor(http: HttpClient) {
    super(http);
  }

  private getUrl(baseUrl: string, searchCriteria: any): string {
    let url = baseUrl;
    let separator = '';

    if (searchCriteria.type) {
      const query = searchCriteria.type.map(el => `"${el}"`);
      url = url.concat(separator).concat('type=in=(').concat(query).concat(')');
      separator = ';';
    }

    if (searchCriteria.status) {
      url = url.concat(separator).concat('status=in=(').concat(searchCriteria.status).concat(')');
      separator = ';';
    }

    if (searchCriteria.from) {
      url = url.concat(separator).concat('importedAt>=').concat(this.toDate(searchCriteria.from, true));
      separator = ';';
    }

    if (searchCriteria.to) {
      url = url.concat(separator).concat('importedAt<=').concat(this.toDate(searchCriteria.to, true));
      separator = ';';
    }

    return url;
  }

  public search(searchCriteria: any, pageable: Pageable) {
    const url = this.getUrl(this.url.concat('?search='), searchCriteria);
    return this.getAll(pageable, url);
  }

  public getAll(pageable: Pageable, url = this.url): Promise<NgPrimeGridResponse> {
    return super.get(url, pageable).then(res => <NgPrimeGridResponse>res);;
  }

  public getFailures(importLogId: number, pageable: Pageable): Promise<NgPrimeGridResponse> {
    const url = `${this.url}/${importLogId}/failures`;
    return super.get(url, pageable).then(res => <NgPrimeGridResponse>res);
  }

  deleteImportLog(importlog: ImportLog) {
    return super.delete(this.url, `${importlog.importedAt}`);
  }
}
