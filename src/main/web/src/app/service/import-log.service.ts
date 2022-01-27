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

  search(criteria: string, pageable: Pageable) {
    return this.getAll(pageable);
  }

  getAll(pageable: Pageable): Promise<NgPrimeGridResponse> {
    return super.get(this.url, pageable).then(res => <NgPrimeGridResponse>res);;
  }

  deleteImportLog(importlog: ImportLog) {
    return super.delete(this.url, `${importlog.importedAt}`);
  }
}
