import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api/selectitem';

import { AbstractComponent } from '../../abstract.component';
import { TemplateService } from '../../service/template.service';

@Component({
  selector: 'import-user-card',
  templateUrl: './import-user-card.component.html',
  styleUrls: ['./import-user-card.component.css'],
})
export class ImportUserCardComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy {

  templates: SelectItem[];
  fileTypes: SelectItem[];

  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;

  constructor(private templateService: TemplateService,
    translate: TranslateService,
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
      thirdCtrl: ['', Validators.required],
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
}
