import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LazyLoadEvent } from "primeng/api/public_api";
import { Table } from "primeng/table";
import { AbstractComponent } from "../../AbstractComponent";
import { ImportLog } from "../../domain/import-log";
import { ImportLogService } from "../../service/import-log.service";

@Component({
  selector: "ngx-import-log",
  templateUrl: "./import-log.component.html",
  styleUrls: ["./import-log.component.css"],
})
export class ImportLogComponent
  extends AbstractComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  importLogs: ImportLog[];
  totalRecords: number;
  cols: any[];
  loading: boolean;
  importLogSearch: string;

  @ViewChild("table", { static: false }) table: Table;

  constructor(
    private importLogService: ImportLogService,
    translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    super(translate);
  }

  ngOnInit(): void {
    this.loadImportLogs(0, 20, "id,asc");

    this.cols = [
      { field: "id", header: "#", width: "50px" },
      { field: "importedAt", header: "Imported At", width: "120px" },
      { field: "type", header: "Type", width: "120px" },
      { field: "status", header: "Status", width: "120px" },
      { field: "count", header: "Count", width: "120px" },
      { field: "message", header: "Message", width: "120px" },
    ];

    // const pageable = { page: 0, size: 20, sort: "id" };
    // this.importLogService.getAll(pageable).then((importlogs: ImportLog[]) => {
    //   this.importLogs = importlogs;
    //   this.totalRecords = importlogs.length / 20;
    // });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadImportLogs(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort };
    this.importLogService.getAll(pageable).then(ngresp => {
      this.importLogs = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }

  loadImportLogsLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortBy =
      event.sortField === undefined
        ? "id"
        : event.sortField === "role"
        ? "role.name"
        : event.sortField;
    const sortOrder = event.sortOrder === -1 ? "desc" : "asc";
    this.loadImportLogs(event.first, event.rows, sortBy + "," + sortOrder);
  }

  delete() {}
}
