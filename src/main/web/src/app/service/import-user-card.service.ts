import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractService } from '../abstract.service';
import { ImportUserCardRespDto } from '../domain/import-user-card-resp.dto';
import { ImportExecutionRequestDto, ImportPreviewResponseDto, ImportProfileDto, ImportValidationResultDto } from '../domain/import-user-card-v2';

@Injectable()
export class ImportUserCardService extends AbstractService {

  private url = this.prefix + 'import-user-card';
  private v2Url = this.prefix + 'api/imports/user-cards';

  constructor(http: HttpClient) { super(http);  }

  upload(formData: FormData) {
   return  super._upload(this.url, formData);
  }

  importAdo(formData: FormData) {
    return  super._upload(this.url + '/ado', formData);
   }

  import(importUserCardRespDto: ImportUserCardRespDto) {
    return this.http.post<any>(this.url + '/import', importUserCardRespDto, this.httpOptions)
      .toPromise();
  }

  preview(formData: FormData, fileType?: string, delimiter?: string, skipHeader?: boolean, cityId?: string | number) {
    const params: string[] = [];
    if (fileType) {
      params.push(`fileType=${encodeURIComponent(fileType)}`);
    }
    if (delimiter) {
      params.push(`delimiter=${encodeURIComponent(delimiter)}`);
    }
    if (skipHeader !== undefined) {
      params.push(`skipHeader=${skipHeader}`);
    }
    if (cityId !== undefined && cityId !== null && cityId !== '') {
      params.push(`cityId=${encodeURIComponent(String(cityId))}`);
    }
    const suffix = params.length ? `?${params.join('&')}` : '';
    return this.http.post<ImportPreviewResponseDto>(`${this.v2Url}/preview${suffix}`, formData, { headers: this.httpOptions.headers.delete('Content-Type') })
      .toPromise();
  }

  validate(request: ImportExecutionRequestDto) {
    return this.http.post<ImportValidationResultDto>(`${this.v2Url}/validate`, request, this.httpOptions)
      .toPromise();
  }

  execute(request: ImportExecutionRequestDto) {
    return this.http.post<ImportValidationResultDto>(`${this.v2Url}/execute`, request, this.httpOptions)
      .toPromise();
  }

  saveProfile(request: ImportExecutionRequestDto) {
    return this.http.post<ImportProfileDto>(`${this.v2Url}/profiles`, request, this.httpOptions)
      .toPromise();
  }

  getProfiles() {
    return this.http.get<ImportProfileDto[]>(`${this.v2Url}/profiles`, this.httpOptions)
      .toPromise();
  }

  getProfile(id: number) {
    return this.http.get<ImportProfileDto>(`${this.v2Url}/profiles/${id}`, this.httpOptions)
      .toPromise();
  }
}
