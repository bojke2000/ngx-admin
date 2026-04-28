import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AbstractComponent } from "../../AbstractComponent";
import { ActivatedRoute } from "@angular/router";
import { ExportUserCardService } from "./../../service/export-user-card.service";
import { HttpResponse } from "@angular/common/http";
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
    this.form2 = this.fb.group({ fileType: ["0", Validators.required], noColumnNames: [false] });
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
    const noColumnNames: boolean = this.form2.controls["noColumnNames"].value;
    const request = historySearch
      ? {
          template: this.form1.controls["template"].value,
          fileType,
          noColumnNames,
          search,
          historySearch,
        }
      : {
          template: this.form1.controls["template"].value,
          fileType,
          noColumnNames,
          search,
        };

    this.exportUserCardService
      .downloadUserCard(request)
      .subscribe((response: HttpResponse<ArrayBuffer>) => {
        const fileName = this.resolveDownloadFileName(
          response.headers.get("content-disposition"),
          fileType
        );
        this.downloadFile(response.body, fileName);
      });
  }

  downloadFile(data: any, fileName) {
    importedSaveAs(new Blob([data], { type: "text/plain" }), fileName);
  }

  getFileName(fileType: string): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const datePart = `${day}${month}${year}`;
    const extension = fileType === "2" ? "xml" : "csv";
    return `Ocitanja_INSA_IMP_${datePart}.${extension}`;
  }

  private resolveDownloadFileName(
    contentDisposition: string,
    fileType: string
  ): string {
    if (!contentDisposition) {
      return this.getFileName(fileType);
    }

    const utf8FileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8FileNameMatch && utf8FileNameMatch[1]) {
      return decodeURIComponent(utf8FileNameMatch[1]).replace(/"/g, "");
    }

    const fileNameMatch = contentDisposition.match(/filename=\"?([^\";]+)\"?/i);
    if (fileNameMatch && fileNameMatch[1]) {
      return fileNameMatch[1].trim();
    }

    return this.getFileName(fileType);
  }
}
