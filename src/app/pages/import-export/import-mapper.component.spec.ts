import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ImportMapperComponent } from './import-mapper.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

describe('ImportComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule,
                TableModule,
                DialogModule
            ],
            declarations: [
                ImportMapperComponent
            ],
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(ImportMapperComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
