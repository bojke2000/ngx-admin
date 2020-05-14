import { AbstractService } from '../abstract.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ExportAdoService extends AbstractService {

  constructor(http: HttpClient) { super(http);  }

  ado() {
   }
}
