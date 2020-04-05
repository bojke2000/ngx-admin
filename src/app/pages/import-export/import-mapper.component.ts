import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';

import { UserCardColumnService } from '../../service/user-card-column.service';

@Component({
  selector: 'import-mapper',
  templateUrl: './import-mapper.component.html',
  styleUrls: ['./import-mapper.component.css'],
})
export class ImportMapperComponent implements OnInit {
  @Input()
  imports: any[];
  @Input()
  cols = [];
  choices: SelectItem[];
  @Output() onSelectValue = new EventEmitter<{ mappings: any }>();

  constructor(private cardColumnService: UserCardColumnService) { }

  ngOnInit() {
    this.cardColumnService.findAllOptions().then(data => this.choices = data);
  }

  onSelectionChange() {
    this.onSelectValue.emit({ mappings: this.getMappings() });
  }

  private getMappings(): any {
    return this.imports[0];
  }

  save() {
    const insaMapping = this.imports[0];
    const result = JSON.stringify(insaMapping);
    alert(result);
  }
}
