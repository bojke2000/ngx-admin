import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AbstractComponent } from '../../AbstractComponent';
import { ExportUserCardService } from './../../service/export-user-card.service';
import { SelectItem } from 'primeng/api/public_api';
import { TemplateService } from './../../service/template.service';
import { TranslateService } from '@ngx-translate/core';
import {saveAs as importedSaveAs} from 'file-saver';

@Component({
  selector: 'ngx-export-user-card',
  templateUrl: './export-user-card.component.html',
})
export class ExportUserCardComponent extends AbstractComponent implements OnInit {

  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  loading = false;
  templates: SelectItem[] = [];
  fileTypes: SelectItem[];

  constructor(
    translate: TranslateService,
    private templateService: TemplateService,
    private exportUserCardService: ExportUserCardService,
    private fb: FormBuilder) {
    super(translate);
  }

  ngOnInit() {
    this.form1 = this.fb.group({ template: ['Export', Validators.required]});
    this.form2 = this.fb.group({ fileType: ['0', Validators.required]});
    this.form3 = this.fb.group({ });

    this.templateService.getTemplates('export')
      .then(templates => this.templates = templates);

      this.fileTypes = [
        { label: 'CSV', value: '0' },
        { label: 'TAB', value: '1' },
        { label: 'XML', value: '2' },
        { label: 'FIXED TXT', value: '3' },
      ];
  }

  onForm1Submit() {
    this.form1.markAsDirty();
  }

  onForm2Submit() {
    this.form2.markAsDirty();
  }

  onDownload(): void {
    const request = {
      template : this.form1.controls['template'].value,
      fileType : this.form2.controls['fileType'].value,
    };

    this.exportUserCardService.downloadUserCard(request)
      .subscribe((data: any) => this.downloadFile(data));
  }

  downloadFile(data: any) {
    importedSaveAs(new Blob([data], { type: 'text/plain' }), 'usercard.csv');
  }
}
