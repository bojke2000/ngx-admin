import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
import { AbstractComponent } from '../../abstract.component';
import { TranslateService } from '@ngx-translate/core';
import { TemplateMapping } from '../../domain/template-mapping';
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

  mappings: TemplateMapping[];
  cols: any[];

  @ViewChild('table', { static: false }) table: Table;

  constructor(private templateService: TemplateService,
    translate: TranslateService,
    private cdr: ChangeDetectorRef) {
    super(translate);
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'key1', header: 'Field', width: '200px' },
      { field: 'val1', header: 'Mapping', width: '200px' },
      { field: 'key2', header: 'Field', width: '200px' },
      { field: 'val2', header: 'Mapping', width: '200px' },
      { field: 'key3', header: 'Field', width: '200px' },
      { field: 'val3', header: 'Mapping', width: '200px' },
    ];

    this.templateService.getTemplates().then(templates => {
      this.templates = templates;
      if (this.templates.length > 0) {
        this.template = templates[0];
        this.templateService.getTemplate(this.template.value).then(result => this.mappings = result.data);
      }
    });
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
