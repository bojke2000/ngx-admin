import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AbstractComponent } from "../../AbstractComponent";
import { ActivatedRoute } from "@angular/router";
import { ExportUserCardService } from "./../../service/export-user-card.service";
import { SelectItem } from "primeng/api/public_api";
import { TemplateService } from "./../../service/template.service";
import { TranslateService } from "@ngx-translate/core";
import { saveAs as importedSaveAs } from "file-saver";

@Component({
  selector: "ngx-export-user-card",
  templateUrl: "./export-user-card.component.html",
})
export class ExportUserCardComponent
  extends AbstractComponent
  implements OnInit
{
  form1: FormGroup;
  form2: FormGroup;
  form3: FormGroup;
  loading = false;
  templates: SelectItem[] = [];
  fileTypes: SelectItem[];
  private search: string;
  private historySearch: string;

  constructor(
    translate: TranslateService,
    private templateService: TemplateService,
    private exportUserCardService: ExportUserCardService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    super(translate);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.search = params.search.toString();
      if (params.historySearch) {
        this.historySearch = params.historySearch.toString();
      }
    });

    this.form1 = this.fb.group({ template: ["Export", Validators.required] });
    this.form2 = this.fb.group({ fileType: ["0", Validators.required] });
    this.form3 = this.fb.group({});

    this.templateService
      .getTemplates("export")
      .then((templates) => (this.templates = templates));

    this.fileTypes = [
      { label: "CSV", value: "0" },
      { label: "TAB", value: "1" },
      { label: "XML", value: "2" },
      { label: "FIXED TXT", value: "3" },
      { label: "SEMI-COL", value: "4" },
    ];
  }

  onForm1Submit() {
    this.form1.markAsDirty();
  }

  onForm2Submit() {
    this.form2.markAsDirty();
  }

  onDownload(): void {
    const { search, historySearch } = this;

    const fileType: string = this.form2.controls["fileType"].value;
    const request = historySearch
      ? {
          template: this.form1.controls["template"].value,
          fileType,
          search,
          historySearch,
        }
      : {
          template: this.form1.controls["template"].value,
          fileType,
          search,
        };

    this.exportUserCardService
      .downloadUserCard(request)
      .subscribe((data: any) =>
        this.downloadFile(data, this.getFileName(fileType))
      );
  }

  downloadFile(data: any, fileName) {
    importedSaveAs(new Blob([data], { type: "text/plain" }), fileName);
  }

  getFileName(fileType: string): string {
    switch (fileType) {
      case "0":
      case "1":
        return "usercard.csv";
      case "2":
        return "usercard.xml";
      case "3":
      case "4":
        return "usercard.txt";
    }
  }
}
