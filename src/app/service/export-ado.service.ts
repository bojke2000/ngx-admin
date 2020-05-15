import { AbstractService } from '../abstract.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ExportAdoService extends AbstractService {
  private url = this.prefix + 'export-ado';

  constructor(http: HttpClient) { super(http);  }

  ado(pageSize: string) {
    return this.get(`${this.url}?pageSize=${pageSize}`);
   }
}
