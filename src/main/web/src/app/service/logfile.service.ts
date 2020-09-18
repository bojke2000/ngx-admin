import { AbstractService } from '../abstract.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LogfileService extends AbstractService {
  private url = this.prefix + 'actuator';

  constructor(http: HttpClient) {
    super(http);
  }

  getLogfile() {
    return super.downloadText(`${this.url}/logfile`);
  }
}
