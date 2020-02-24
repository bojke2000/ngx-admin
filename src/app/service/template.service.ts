import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';
import { TemplateDto } from '../domain/template-dto';


@Injectable()
export class TemplateService extends AbstractService {

  private url = this.prefix + 'templates';

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
      .then(res => <TemplateDto>res);
  }

  updateTemplate(templateDto: TemplateDto): Observable<TemplateDto> {
    return this.http.put<TemplateDto>(this.url,
      templateDto, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
