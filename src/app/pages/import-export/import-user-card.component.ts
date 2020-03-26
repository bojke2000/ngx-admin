import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Observable, of } from 'rxjs';

import { AbstractComponent } from '../../abstract.component';
import { ImportUserCardService } from '../../service/import-user-card.service';

@Component({
  selector: 'import-user-card',
  templateUrl: './import-user-card.component.html',
  styleUrls: ['./import-user-card.component.css'],
  providers: [MessageService],
})
export class ImportUserCardComponent extends AbstractComponent implements OnInit {

  fileTypes: SelectItem[];
  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  fourthForm: FormGroup;
  imports: any[];
  cols: any[];
  loading = false;
  fileName?: string = undefined;
  mappings = undefined;
  uploadedFiles: any[] = [];

  constructor(
    translate: TranslateService,
    private importUserCardService: ImportUserCardService,
    private fb: FormBuilder) {
    super(translate);
  }

  get imports$(): Observable<any[]> {
    return of(this.imports);
  }

  ngOnInit() {

    this.firstForm = this.fb.group({
      fileType: ['XML', [Validators.required]],
    });

    this.secondForm = this.fb.group({
      uploadFlag: [undefined, Validators.requiredTrue],
    });

    this.thirdForm = this.fb.group({
      mappings: ['', Validators.required],
    });

    this.fileTypes = [
      { label: 'XML', value: 'XML' },
      { label: 'CSV', value: 'CSV' },
      { label: 'XLS', value: 'XLS' },
    ];
  }

  private toSelected(mappings: any[]): any[] {
    const selected = [];
    const keys = Object.keys(mappings);
    for (const key of keys) {
      const val: string = this.mappings[key];
      if (this.mappings.hasOwnProperty(key) && val && !val.startsWith('[')) {
        const element = {col: key, value: mappings[key]};
        selected.push(element);
      }
    }

    return selected;
  }

  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
    this.loading = true;
    const postData = {mappings: this.toSelected(this.mappings), fileName: this.fileName};
    this.importUserCardService.import(postData).then(resp => {
      this.loading = false;
    });
  }

  onFileUpload(data: { files: File }): void {
    this.loading = true;
    const formData: FormData = new FormData();

    const file = data.files[0];
    formData.append('importFile', file, file.name);
    this.fileName = file.name;
    this.importUserCardService.upload(formData).then(importSample => {

      if (importSample.samples.length > 0) {
        const keys = Object.keys(importSample.samples[0]);
        const obj: { [k: string]: any } = {};
        for (const key of keys) {
          obj[key] = this.translate.instant('[Mapping]');
        }

        this.cols = [...importSample.columns];
        this.imports = [obj, ...importSample.samples];
      }
      this.loading = false;
      this.secondForm.patchValue({ uploadFlag: true });
    });
  }

  selectValue(obj: any) {
    this.mappings = obj.mappings;
  }
}
