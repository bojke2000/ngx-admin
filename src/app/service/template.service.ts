import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../abstract.service';
import { NgPrimeGridResponse } from '../domain/ngprime-grid-response';
import { Option } from '../domain/option';

@Injectable()
export class TemplateService extends AbstractService {

    private url = 'http://localhost:8081/templates';

    constructor(private http: HttpClient) {
      super();
     }

    getTemplates() {
      return this.http.get<any>(this.url)
        .toPromise()
        .then(res => <Option[]>res);
    }

    getTemplate(templateId: string) {
      return this.http.get<any>(this.url.concat('/').concat(templateId))
        .toPromise()
        .then(res => <NgPrimeGridResponse>res);
    }
  }
