import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';
import { TemplateDto } from '../domain/template.dto';


@Injectable()
export class TemplateService extends AbstractService {

  private url = this.prefix + 'templates';

  constructor(http: HttpClient) {
    super(http);
  }

  getTemplates(name?: string) {
    let url = this.url;
    if (name) {
      url = url + '?name=' + name;
    }
    return this.http.get<any>(url)
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

  addTemplate(dto: TemplateDto): Observable<TemplateDto> {
    return this.http.post<TemplateDto>(this.url, dto, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteTemplate(id: string): Observable<TemplateDto> {
    const url = `${this.url}/${id}`; // DELETE api/heroes/42
    return this.http.delete<TemplateDto>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
