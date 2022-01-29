import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LazyLoadEvent, SelectItem } from "primeng/api/public_api";
import { Table } from "primeng/table";
import { AbstractComponent } from "../../AbstractComponent";
import { ImportLog } from "../../domain/import-log";
import { NgPrimeGridResponse } from "../../domain/ngprime-grid-response";
import { Pageable } from "../../domain/pageable";
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
  from: string = undefined;
  to: string = undefined;
  type: string;
  types: SelectItem[] = [];
  status: string;
  statuses: SelectItem[] = [];
  // state of pagination
  sortBy: string;
  sortOrder: string;
  page: number;
  rows: number;

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
      { field: "type", header: "Type", width: "120px" },
      { field: "importedAt", header: "Imported At", width: "120px" },
      { field: "status", header: "Status", width: "120px" },
      { field: "count", header: "Number of consumers read", width: "120px" },
      { field: "message", header: "Message", width: "120px" },
    ];

    this.types = [
      { label: "WMBus Email", value: "WMBus Email" },
      { label: "Lora", value: "Lora" },
      { label: "ADO Import", value: "ADO Import" },
      { label: "ADO Reader", value: "ADO Reader" },
      { label: "Device Import", value: "Device Import" },
      { label: "Upload Import", value: "Upload Import" },
    ];

    this.statuses = [
      { label: "OK", value: 0 },
      { label: "Error", value: 1 },
    ];
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadImportLogsLazy(event: LazyLoadEvent) {
    this.loading = true;
    this.sortBy =
      event.sortField === undefined
        ? "id"
        : event.sortField === "city"
        ? "cityId"
        : event.sortField;
    this.sortOrder = event.sortOrder === -1 ? "desc" : "asc";
    this.page = event.first / event.rows;
    this.rows = event.rows;
    this.loadImportLogs(
      event.first / event.rows,
      event.rows,
      this.sortBy + "," + this.sortOrder
    );
  }

  private loadImportLogs(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort };
    this.importLogService.getAll(pageable).then((ngresp) => {
      this.importLogs = ngresp.data;
      this.totalRecords = ngresp.totalRecords;
      this.loading = false;
    });
  }

  delete() {}

  getSearchCriteria() {
    const { status, type, from, to } = this;
    return {
      status: status ? status.toString() : undefined,
      type,
      from,
      to,
    };
  }

  getPageable(): Pageable {
    return {
      page: this.page,
      size: this.rows,
      sort: `${this.sortBy},${this.sortOrder}`,
    };
  }

  search() {
    try {
      this.page = 0;
      this.importLogService
        .search(this.getSearchCriteria(), this.getPageable())
        .then((ngresp: NgPrimeGridResponse) => {
          this.importLogs = ngresp.data;
          this.totalRecords = ngresp.totalRecords;
          this.loading = false;
        });
    } catch (error) {
      console.log(error);
    }
  }

  clear() {
    this.from = undefined;
    this.to = undefined;
    this.status = undefined;
    this.type = undefined;
    this.search();
  }
}
