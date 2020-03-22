import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ImportUserCardService } from '../../service/import-user-card.service';

@Component({
  selector: 'import-mapper',
  templateUrl: './import-mapper.component.html',
  styleUrls: ['./import-mapper.component.css'],
  providers: [ImportUserCardService],
})
export class ImportMapperComponent implements OnInit {
  @Input()
  imports: any[];
  @Input()
  cols = [];
  choices: SelectItem[];
  @Output() onSelectValue = new EventEmitter<{ mappings: any }>();

  ngOnInit() {
    this.choices = [
      { label: 'Audi', value: 'Audi' },
      { label: 'BMW', value: 'BMW' },
      { label: 'Fiat', value: 'Fiat' },
      { label: 'Ford', value: 'Ford' },
      { label: 'Honda', value: 'Honda' },
      { label: 'Jaguar', value: 'Jaguar' },
      { label: 'Mercedes', value: 'Mercedes' },
      { label: 'Renault', value: 'Renault' },
      { label: 'VW', value: 'VW' },
      { label: 'Volvo', value: 'Volvo' },
    ];
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
