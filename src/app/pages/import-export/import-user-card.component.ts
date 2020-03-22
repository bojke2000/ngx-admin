import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
export class ImportUserCardComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy {

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

  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
    this.loading = true;
    const postMappings = [];
    const keys = Object.keys(this.mappings);
    for (const key of keys) {
      const val: string = this.mappings[key];
      if (this.mappings.hasOwnProperty(key) && val && !val.startsWith('[')) {
        const element = {id: key, name: this.mappings[key]};
        postMappings.push(element);
      }
    }
    const postData = {mappings: postMappings, fileName: this.fileName};
    this.importUserCardService.import(postData).then(resp => {
      this.loading = false;
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  onFileUpload(data: { files: File }): void {
    this.loading = true;
    const formData: FormData = new FormData();

    const file = data.files[0];
    formData.append('importFile', file, file.name);
    this.fileName = file.name;
    this.importUserCardService.upload(formData).then(mappingData => {

      if (mappingData.length > 0) {
        const newCols = [];
        const keys = Object.keys(mappingData[0]);
        const obj: { [k: string]: any } = {};
        for (const key of keys) {
          obj[key] = this.translate.instant('[Mapping]');
        }

        for (const key of keys) {
          newCols.push({ 'field': key, 'header': key });
        }

        this.cols = newCols;
        this.imports = [obj, ...mappingData];
      }
      this.loading = false;
      this.secondForm.patchValue({ uploadFlag: true });
    });
  }

  selectValue(obj: any) {
    this.mappings = obj.mappings;
  }
}
