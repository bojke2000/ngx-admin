import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AbstractComponent } from '../../AbstractComponent';
import { SelectItem } from 'primeng/api/public_api';
import { TemplateService } from './../../service/template.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-export-user-card',
  templateUrl: './export-user-card.component.html',
})
export class ExportUserCardComponent extends AbstractComponent implements OnInit {

  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  loading = false;
  templates: SelectItem[] =[];
  fileTypes: SelectItem[];

  constructor(
    translate: TranslateService,
    private templateService: TemplateService,
    private fb: FormBuilder) {
    super(translate);
  }

  ngOnInit() {
    this.form1 = this.fb.group({ template: ['Export', Validators.required]});
    this.form2 = this.fb.group({ fileType: ['CSV', Validators.required]});
    this.form3 = this.fb.group({ });

    this.templateService.getTemplates('export')
      .then(templates => this.templates = templates);

      this.fileTypes = [
        { label: 'XML', value: 'XML' },
        { label: 'CSV', value: 'CSV' },
        { label: 'TAB', value: 'TAB' },
        { label: 'FIXED TXT', value: 'FIXED TXT' },
      ];
  }

  onForm1Submit() {
    this.form1.markAsDirty();
  }

  onForm2Submit() {
    this.form2.markAsDirty();
  }

  onDownload(): void {
  }
}
