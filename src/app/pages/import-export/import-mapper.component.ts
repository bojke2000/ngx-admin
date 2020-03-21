import { Component, Input, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Observable, of } from 'rxjs';

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

    public get myImports$(): Observable<any[]> {
        return of(this.imports);
    }

    public get cols$() {
        return of(this.cols);
    }

    constructor(private importService: ImportUserCardService) { }

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

    save() {
        const insaMapping = this.imports[0];
        const result = JSON.stringify(insaMapping);
        alert(result);
    }
}
