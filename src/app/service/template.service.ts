import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AbstractService } from '../abstract.service';
import { Option } from '../domain/option';
import { TemplateDto } from '../domain/template-dto';


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
        .then(res => <TemplateDto>res);
    }

    updateTemplate(templateDto: TemplateDto): Observable<TemplateDto> {
      return this.http.put<TemplateDto>(this.url,
              templateDto, this.httpOptions)
      .pipe(catchError(this.handleError));
    }

    updateHero (templateDto: TemplateDto): Observable<any> {
      return this.http.put(this.url, templateDto, this.httpOptions).pipe(
        tap(_ => console.log(`updated hero id=${templateDto.id}`)),
        catchError(this.handleError1<any>('updateHero')));
    }


    private handleError1<T> (operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {

        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption
        console.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

  }
