import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, SelectItem } from 'primeng/api';

import { AbstractComponent } from '../../abstract.component';
import { ImportUserCardService } from '../../service/import-user-card.service';
import { TemplateService } from '../../service/template.service';

@Component({
  selector: 'import-user-card',
  templateUrl: './import-user-card.component.html',
  styleUrls: ['./import-user-card.component.css'],
  providers: [MessageService],
})
export class ImportUserCardComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy {

  templates: SelectItem[];
  fileTypes: SelectItem[];

  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;

  uploadedFiles: any[] = [];

  constructor(private templateService: TemplateService,
    translate: TranslateService,
    private importUserCardService: ImportUserCardService,
    private fb: FormBuilder) {
    super(translate);
  }

  ngOnInit() {
    this.firstForm = this.fb.group({
      templateName: ['', [Validators.required]],
    });

    this.secondForm = this.fb.group({
      fileType: ['XML', [Validators.required]],
    });

    this.thirdForm = this.fb.group({
      uploadFlag: [undefined, Validators.requiredTrue],
    });

    this.loadTemplates();

    this.fileTypes = [
      {label: 'XML', value: 'XML'},
      {label: 'CSV', value: 'CSV'},
      {label: 'XLS', value: 'XLS'},
    ];
  }

  private loadTemplates() {
    this.templateService.getTemplates().then(templates => {
      this.templates = templates;
      if (this.templates.length > 0) {
        this.firstForm.patchValue({'templateName': templates[0].value});
      }
    });
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

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  onFileUpload(data: { files: File }): void {
    const formData: FormData = new FormData();

    const file = data.files[0];
    formData.append('importFile', file, file.name);
    this.importUserCardService.importUserCard(formData).then(() => {
        this.thirdForm.patchValue({uploadFlag: true});
    });
  }
}
