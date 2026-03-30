import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LazyLoadEvent } from "primeng/api/public_api";
import { AbstractComponent } from "../../AbstractComponent";
import { ImportLogFailure } from "../../domain/import-log-failure";
import { ImportLogService } from "../../service/import-log.service";

@Component({
  selector: "ngx-import-log-failures",
  templateUrl: "./import-log-failures.component.html",
  styleUrls: ["./import-log.component.css"],
})
export class ImportLogFailuresComponent
  extends AbstractComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  importLogId: number;
  failures: ImportLogFailure[] = [];
  totalRecords = 0;
  loading = false;
  cols: any[];

  constructor(
    private importLogService: ImportLogService,
    private route: ActivatedRoute,
    private router: Router,
    translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    super(translate);
  }

  ngOnInit(): void {
    this.importLogId = Number(this.route.snapshot.paramMap.get("id"));
    this.cols = [
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

    this.loadFailures(0, 20, "rowNumber,asc");
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFailuresLazy(event: LazyLoadEvent) {
    const sortField = event.sortField || "rowNumber";
    const sortOrder = event.sortOrder === -1 ? "desc" : "asc";
    this.loadFailures(event.first / event.rows, event.rows, `${sortField},${sortOrder}`);
  }

  private loadFailures(page: number, size: number, sort?: string) {
    this.loading = true;
    this.importLogService.getFailures(this.importLogId, { page, size, sort }).then((response) => {
      this.failures = response.data || [];
      this.totalRecords = response.totalRecords;
      this.loading = false;
    });
  }

  back() {
    this.router.navigate(["/pages/import-log"]);
  }
}
