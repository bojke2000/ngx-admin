import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LazyLoadEvent, SelectItem } from "primeng/api/public_api";
import { Table } from "primeng/table";
import { AbstractComponent } from "../../AbstractComponent";
import { ImportLog } from "../../domain/import-log";
import { ImportLogFailure } from "../../domain/import-log-failure";
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
  displayFailuresDialog = false;
  selectedImportLogId: number;
  failures: ImportLogFailure[] = [];
  failureTotalRecords = 0;
  failureLoading = false;
  failureCols: any[] = [];
  // state of pagination
  sortBy: string;
  sortOrder: string;
  page: number;
  rows: number;

  @ViewChild("table", { static: false }) table: Table;

  constructor(
    private importLogService: ImportLogService,
    private router: Router,
    translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    super(translate);
  }

  ngOnInit(): void {
    this.loadImportLogs(0, 20, "id,asc");

    this.cols = [
      { field: "id", header: "#", width: "50px" },
      { field: "type", header: "Type", width: "180px" },
      { field: "importedAt", header: "Imported At", width: "170px" },
      { field: "status", header: "Status", width: "100px" },
      { field: "totalRows", header: "Total Rows", width: "110px" },
      { field: "successCount", header: "Imported", width: "110px" },
      { field: "failedCount", header: "Failed", width: "110px" },
      { field: "skippedCount", header: "Skipped", width: "110px" },
      { field: "message", header: "Message", width: "260px" },
      { field: "failureDetails", header: "Failures", width: "110px" },
    ];

    this.types = [
      { label: "WMBus Email", value: "WMBus Email" },
      { label: "Lora", value: "Lora" },
      { label: "ADO Import", value: "ADO Import" },
      { label: "ADO Reader", value: "ADO Reader" },
      { label: "Device Import", value: "Device Import" },
      { label: "Upload Import", value: "Upload Import" },
      { label: "User Card REST Import", value: "User Card REST Import" },
      { label: "User Card REST Validation", value: "User Card REST Validation" },
    ];

    this.statuses = [
      { label: "OK", value: 0 },
      { label: "Error", value: 1 },
    ];

    this.failureCols = [
      { field: "rowNumber", header: "Row", width: "80px" },
      { field: "status", header: "Status", width: "100px" },
      { field: "customerId", header: "Customer ID", width: "140px" },
      { field: "deviceId", header: "Device ID", width: "140px" },
      { field: "targetField", header: "Target Field", width: "140px" },
      { field: "value", header: "Value", width: "140px" },
      { field: "message", header: "Message", width: "240px" },
      { field: "rawRow", header: "Raw Row", width: "420px" },
      { field: "createdAt", header: "Logged At", width: "170px" },
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
      this.importLogs = (ngresp.data || []).map((log: ImportLog) => ({
        ...log,
        failureDetails: log.hasFailureDetails ? "View" : "",
      }));
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
          this.importLogs = (ngresp.data || []).map((log: ImportLog) => ({
            ...log,
            failureDetails: log.hasFailureDetails ? "View" : "",
          }));
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

  onTableClick(event: { column: string; row: ImportLog }) {
    if (event.column !== "failureDetails" || !event.row?.hasFailureDetails) {
      return;
    }
    this.openFailures(event.row.id);
  }

  loadFailuresLazy(event: LazyLoadEvent) {
    const sortField = event.sortField || "rowNumber";
    const sortOrder = event.sortOrder === -1 ? "desc" : "asc";
    const rows = event.rows || 20;
    const first = event.first || 0;
    this.loadFailures(first / rows, rows, `${sortField},${sortOrder}`);
  }

  closeFailures() {
    this.displayFailuresDialog = false;
    this.selectedImportLogId = undefined;
    this.failures = [];
    this.failureTotalRecords = 0;
  }

  private openFailures(importLogId: number) {
    this.selectedImportLogId = importLogId;
    this.displayFailuresDialog = true;
    this.loadFailures(0, 20, "rowNumber,asc");
  }

  private loadFailures(page: number, size: number, sort?: string) {
    if (!this.selectedImportLogId) {
      return;
    }

    this.failureLoading = true;
    this.importLogService
      .getFailures(this.selectedImportLogId, { page, size, sort })
      .then((response) => {
        this.failures = response.data || [];
        this.failureTotalRecords = response.totalRecords;
        this.failureLoading = false;
      })
      .catch(() => {
        this.failures = [];
        this.failureTotalRecords = 0;
        this.failureLoading = false;
      });
  }
}
