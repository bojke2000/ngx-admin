import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ImportUserCardService } from '../../service/import-user-card.service';

@Component({
    selector: 'import-mapper',
    templateUrl: './import-mapper.component.html',
    styleUrls: ['./import-mapper.component.css'],
    providers: [ImportUserCardService]
})
export class ImportMapperComponent implements OnInit {

    imports: any[];
    cols = new Array();
    choices: SelectItem[];

    constructor(private importService: ImportUserCardService) { }

    ngOnInit() {
        this.importService.loadImport().then(imports => {
            const keys = Object.keys(imports[0]);
            const obj: {[k: string]: any} = {};
            for (const key of keys) {
                obj[key] = '[Click To Select Mapping]';
            }
            this.imports = [obj, ...imports];

            for (const key of keys) {
                this.cols.push({'field': key, 'header': key});
            }
            return this.imports;
        });

        this.choices = [
            {label: 'Audi', value: 'Audi'},
            {label: 'BMW', value: 'BMW'},
            {label: 'Fiat', value: 'Fiat'},
            {label: 'Ford', value: 'Ford'},
            {label: 'Honda', value: 'Honda'},
            {label: 'Jaguar', value: 'Jaguar'},
            {label: 'Mercedes', value: 'Mercedes'},
            {label: 'Renault', value: 'Renault'},
            {label: 'VW', value: 'VW'},
            {label: 'Volvo', value: 'Volvo'}
        ];
    }

    save() {
        const insaMapping = this.imports[0];
        const result = JSON.stringify(insaMapping);
        alert(result);
    }
}
