import { AbstractService } from '../abstract.service';
import { HttpClient } from '@angular/common/http';
import { ImportUserCardRespDto } from '../domain/import-user-card-resp.dto';
import { Injectable } from '@angular/core';

@Injectable()
export class ExportAdoService extends AbstractService {

  private url = this.prefix + 'export-ado';

  constructor(http: HttpClient) { super(http);  }

  ado(formData: FormData) {
   // return  super._download(this.url + '/ado', formData);
   }
}
