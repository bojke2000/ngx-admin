import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
import { AbstractComponent } from '../../abstract.component';
import { TranslateService } from '@ngx-translate/core';
import { Template } from '../../domain/template';
import { TemplateService } from '../../service/template.service';
import { Option } from '../../domain/option';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'ie-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent extends AbstractComponent implements OnInit, AfterViewInit {
  templates: Option[];
  template: Option;

  mappings: Template[];
  selectedTemplate: Template;
  cols: any[];

  @ViewChild('table', { static: false }) table: Table;

  constructor(private templateService: TemplateService,
    translate: TranslateService,
    private cdr: ChangeDetectorRef) {
    super(translate);
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'field', header: 'Field', width: '200px' },
      { field: 'mapping', header: 'Mapping', width: '200px' },
      { field: 'field', header: 'Field', width: '200px' },
      { field: 'mapping', header: 'Mapping', width: '200px' },
      { field: 'field', header: 'Field', width: '200px' },
      { field: 'mapping', header: 'Mapping', width: '200px' },
    ];

    this.templateService.getTemplates().then(templates => {
      this.templates = templates;
    });

    this.mappings = [];
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  onTemplateChange() {
    this.templateService.getTemplate(this.template.value).then(ngresp => {
        this.mappings = ngresp.data;
    });
  }

  save() {}

  delete() {}

}
