import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { AbstractComponent } from "../../AbstractComponent";
import { LazyLoadEvent } from "primeng/api";
import { NgPrimeGridResponse } from "../../domain/ngprime-grid-response";
import { TranslateService } from "@ngx-translate/core";
import { UsageHistoryService } from "../../service/usage-history.service";
import { UserCardService } from "./../../service/user-card.service";
import { ImageService } from "../../service/image.service";

@Component({
  selector: "ngx-user-card-details",
  templateUrl: "./user-card-details.component.html",
  styleUrls: ["./user-card-details.component.css"],
})
export class UserCardDetailsComponent
  extends AbstractComponent
  implements OnInit
{
  customerId: string | undefined = undefined;
  customerName: string | undefined = undefined;
  address: string | undefined = undefined;
  addressNo: string | undefined = undefined;
  deviceId: string | undefined = undefined;
  gsmId: string | undefined = undefined;
  readTimestamp: string | undefined = undefined;
  usageCurrent: number | undefined = undefined;
  usageCurrentReverse: number | undefined = undefined;
  usageCurrentMonth: number | undefined = undefined;
  diffLastRead: number | undefined = undefined;
  magneticSabotageTime: number | undefined = undefined;
  valveStatus: number | undefined = undefined;
  valvePosition: number | undefined = undefined;
  deviceType: number | undefined = undefined;

  @Input()
  userCardId = undefined;
  cols = [
    { field: "usageCurrent", header: "Watermeter Status", width: "70px" },
    {
      field: "usageCurrentReverse",
      header: "Reverse Flow Status",
      width: "70px",
    },
    {
      field: "usageCurrentMonth",
      header: "Status on day of reading",
      width: "70px",
    },
    //{ field: 'usageAverage', header: 'Average Usage', width: '70px' },
    { field: "readTimestamp", header: "Read Datetime", width: "70px" },
    { field: "valveStatus", header: "Valve Status", width: "70px" },
    { field: "valvePosition", header: "Valve Position", width: "70px" },
  ];
  usageHistory: any[] = [];
  totalRecords = 0;
  loading = false;
  sortBy = "id";
  sortOrder = "desc";
  page: number | undefined = undefined;
  rows: number | undefined = undefined;
  initialized = false;
  img = "http://localhost:8081/images/1?rand=" + new Date().getTime();
  imageAvailable = true;

  // chart
  data = {
    labels: [],
    datasets: [],
  };

  @Input()
  displayDialog = false;
  @Output()
  closeFunction = new EventEmitter();
  displayImageDialog: boolean = false;

  constructor(
    translate: TranslateService,
    private readonly userCardService: UserCardService,
    private readonly usageHistoryService: UsageHistoryService,
    private readonly imageService: ImageService
  ) {
    super(translate);
  }

  onHide(): void {
    const { displayDialog } = this;

    if (this.closeFunction) {
      this.closeFunction.emit(displayDialog);
    }
  }

  ngOnInit(): void {}

  onShow() {
    const { imageService } = this;

    if (this.initialized) {
      this.loadPage(0, 7, this.sortBy + "," + this.sortOrder);
    } else {
      this.initialized = true;
    }

    this.userCardService.getById(this.userCardId).then((dto: any) => {
      this.customerId = dto.customerId;
      this.address = dto.address + " " + dto.addressNo;
      this.addressNo = dto.addressNo;
      this.customerName = dto.customerName;
      this.deviceId = dto.deviceId;
      this.gsmId = dto.gsmId;
      this.usageCurrent = this.round(dto.usageCurrent);
      this.usageCurrentReverse = this.round(dto.usageCurrentReverse);
      this.usageCurrentMonth = this.round(dto.usageCurrentMonth);
      this.readTimestamp = dto.readTimestamp;
      this.diffLastRead = this.round(dto.diffLastRead);
      this.magneticSabotageTime = dto.magneticSabotageTime;
      this.valveStatus = dto.valveStatus;
      this.valvePosition = dto.valvePosition;
      this.deviceType = dto.deviceType;
      if (this.customerId) {
        this.img = imageService.getURL(this.customerId);
        this.imageAvailable = true;
      }
    });

    this.loadUsageCurrentChartData();
  }

  private loadPage(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort };
    this.usageHistoryService
      .findBy(this.getSearchCriteria(), pageable)
      .then((ngresp: any) => {
        this.usageHistory = this.processResponse(ngresp);
        this.totalRecords = ngresp.totalRecords;
        this.loading = false;
      });
  }

  private processResponse(ngresp: NgPrimeGridResponse): any[] {
    return ngresp.data.map((elem) => {
      elem.usageCurrent = this.round(elem.usageCurrent);
      elem.usageCurrentReverse = this.round(elem.usageCurrentReverse);
      elem.usageCurrentMonth = this.round(elem.usageCurrentMonth);
      elem.usageAverage = this.round(elem.usageAverage);
      elem.diffLastRead = this.round(elem.diffLastRead);
      return elem;
    });
  }

  private round(value: number | undefined): any {
    return value !== undefined ? Math.round(value * 100) / 100 : undefined;
  }

  loadUsageHistoryLazy(event: LazyLoadEvent) {
    this.loading = true;
    this.sortBy = "readTimestamp";
    this.sortOrder = "desc";
    if (event.rows && event.first !== undefined) {
      this.page = event.first / event.rows;
      this.rows = event.rows;
      this.loadPage(
        event.first / event.rows,
        event.rows,
        this.sortBy + "," + this.sortOrder
      );
    }
  }

  getSearchCriteria() {
    const { userCardId } = this;

    return { userCardId };
  }

  showImage(): boolean {
    if (!this.imageAvailable) {
      return false;
    }
    this.displayImageDialog = true;
    return false;
  }

  onDialogImageShow(): void {
    const { imageService } = this;
    if (this.customerId) {
      this.img = imageService.getURL(this.customerId);
      this.imageAvailable = true;
    }
  }

  onImageError(): void {
    this.imageAvailable = false;
  }

  private loadUsageCurrentChartData(): void {
    this.usageHistoryService
      .getCharData(this.userCardId)
      .then((resp: any) => {
        const rows = Array.isArray(resp)
          ? resp
          : Array.isArray(resp?.data)
          ? resp.data
          : [];
        this.data = this.buildUsageCurrentChartData(rows);
      })
      .catch(() => {
        this.data = {
          labels: [],
          datasets: [],
        };
      });
  }

  private buildUsageCurrentChartData(rows: any[]) {
    const labels = [
      "Januar",
      "Februar",
      "Mart",
      "April",
      "Maj",
      "Jun",
      "Juli",
      "August",
      "Septembar",
      "Oktobar",
      "Novembar",
      "Decembar",
    ];
    const values = new Array(12).fill(0);

    rows.forEach((row: any) => {
      const monthNo = Number(row?.month);
      const monthIndex = Number.isInteger(monthNo) ? monthNo - 1 : -1;
      if (monthIndex >= 0 && monthIndex < 12) {
        values[monthIndex] = this.round(
          Number(row?.usageCurrent ?? row?.usageCurrentMonth) || 0
        );
      }
    });

    const label = this.translate.instant("Watermeter Status")
      ? this.translate.instant("Watermeter Status")
      : "Watermeter Status";

    return {
      labels,
      datasets: [
        {
          label,
          backgroundColor: "#9CCC65",
          borderColor: "#7CB342",
          data: values,
        },
      ],
    };
  }
}
