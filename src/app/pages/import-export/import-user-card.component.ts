import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Observable, of } from 'rxjs';

import { AbstractComponent } from '../../AbstractComponent';
import { CityService } from '../../service/city.service';
import { ImportUserCardService } from '../../service/import-user-card.service';
import { DeviceType } from '../../domain/device-type';

@Component({
  selector: 'ngx-import-user-card',
  templateUrl: './import-user-card.component.html',
  styleUrls: ['./import-user-card.component.css'],
  providers: [MessageService],
})
export class ImportUserCardComponent extends AbstractComponent implements OnInit {

  fileTypes: SelectItem[];
  deviceTypes: SelectItem[];
  zeroForm: FormGroup;
  deviceForm: FormGroup;
  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  fourthForm: FormGroup;
  data: any[];
  cols: any[];
  uploadedFiles: any[] = [];
  loading = false;
  fileName?: string = undefined;
  mappings = undefined;
  cities: SelectItem[];

  constructor(
    translate: TranslateService,
    private router: Router,
    private cityService: CityService,
    private importUserCardService: ImportUserCardService,
    private fb: FormBuilder) {
    super(translate);
  }

  get data$(): Observable<any[]> {
    return of(this.data);
  }

  ngOnInit() {

    this.zeroForm = this.fb.group({ city: [undefined, [Validators.required]]});
    this.cityService.getCitiesAsOptions().then(cities => {
      this.cities = cities;
      this.zeroForm.patchValue({city: this.cities[0].value});
    });
    this.deviceForm = this.fb.group({ deviceType: [undefined, [Validators.required]]});
    this.firstForm = this.fb.group({ fileType: [undefined, [Validators.required]]});
    this.secondForm = this.fb.group({ uploadFlag: [undefined, Validators.requiredTrue]});
    this.thirdForm = this.fb.group({ mappings: ['']});

    this.fileTypes = [
      { label: 'XML', value: 'XML' },
      { label: 'CSV', value: 'CSV' },
      { label: 'TAB', value: 'TAB' },
      { label: 'DBF', value: 'DBF' },
    ];
    this.firstForm.patchValue({fileType: 'XML'});

    this.deviceTypes = [
      { label: 'GMS2 Device', value: DeviceType.DEVICE_GSM },
      { label: 'WMBUS Device', value: DeviceType.DEVICE_WMBUS },
    ];
    this.deviceForm.patchValue({deviceType: DeviceType.DEVICE_GSM});

  }

  private toSelected(mappings: any[]): any[] {
    const selected = [];
    const keys = Object.keys(mappings);
    for (const key of keys) {
      const val: string = this.mappings[key];
      if (this.mappings.hasOwnProperty(key) && val && !val.startsWith('[')) {
        const col = key;
        const element = { col: col, value: mappings[key] };
        selected.push(element);
      }
    }

    return selected;
  }

  onZeroSubmit() {
    this.zeroForm.markAsDirty();
  }

  onDeviceFormSubmit() {
    this.deviceForm.markAsDirty();
  }

  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

  onImport() {
    this.loading = true;

    const importUserCardRespDto = {
      cityId: this.zeroForm.value.city,
      deviceType: this.deviceForm.controls['deviceType'].value,
      fileName: this.fileName,
      fileType: this.firstForm.controls['fileType'].value,
      mappings: this.toSelected(this.mappings),
    };

    this.importUserCardService.import(importUserCardRespDto).then(() => {
      this.loading = false;
      this.router.navigate(['/pages/device']);
    });
  }

  onFileUpload(data: { files: File }): void {
    this.loading = true;
    const formData: FormData = new FormData();

    const file = data.files[0];
    formData.append('importFile', file, file.name);
    this.fileName = file.name;
    this.importUserCardService.upload(formData).then(importUserCardDto => {

      if (importUserCardDto.data.length > 0) {
        const keys = Object.keys(importUserCardDto.data[0]);
        const obj: { [k: string]: any } = {};
        for (const key of keys) {
          obj[key] = this.translate.instant('[Mapping]');
        }

        this.cols = [...importUserCardDto.cols];
        this.data = [obj, ...importUserCardDto.data];
      }
      this.loading = false;
      this.secondForm.patchValue({ uploadFlag: true });
    });
  }

  selectValue(obj: any) {
    this.mappings = obj.mappings;
  }
}
