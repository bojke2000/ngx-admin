import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { LazyLoadEvent } from "primeng/api/public_api";
import { Table } from "primeng/table";
import { of } from "rxjs";
import { distinctUntilChanged, takeUntil } from "rxjs/operators";
import { AbstractComponent } from "../../AbstractComponent";
import { LoraConfig } from "../../domain/lora-config";
import { LoraConfigService } from "../../service/lora-config.service";
import { UserAccountService } from "../../service/user-account.service";

@Component({
  selector: "ngx-lora-config",
  templateUrl: "./lora-config.component.html",
  styleUrls: ["./lora-config.component.css"],
})
export class LoraConfigComponent
  extends AbstractComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  loraConfigForm: FormGroup;
  submitted = false;
  loraConfigs: LoraConfig[];
  loraConfig: LoraConfig;
  selectedLoraConfig: LoraConfig;
  newLoraConfig: boolean;
  totalRecords: number;
  cols: any[];
  loading: boolean;
  loraConfigSearch: string;
  displayDialog: boolean;
  displayInfoDialog;
  displayInfoDialogMessage = '';

  isVisible = true;

  @ViewChild("table", { static: false }) table: Table;

  constructor(
    private loraConfigService: LoraConfigService,
    translate: TranslateService,
    private formBuilder: FormBuilder,

    private userAccountService: UserAccountService,
    private cdr: ChangeDetectorRef
  ) {
    super(translate);
  }

  ngOnInit(): void {
    this.loadLoraConfigs(0, 20, "id,asc");

    this.isVisible = this.userAccountService.isSuperadmin();

    this.cols = [
      { field: "id", header: "#", width: "50px" },
      { field: "loraOn", header: "Lora On", width: "120px" },
      { field: "email", header: "Email", width: "120px" },
      { field: "password", header: "Password", width: "120px" },
      { field: "organization", header: "Organization", width: "120px" },
      { field: "restUrl", header: "Rest URL", width: "120px" },
      { field: "mqttUrl", header: "MQTT Url", width: "120px" },
    ];

    this.loraConfigForm = this.formBuilder.group({
      id: [""],
      loraOn: [""],
      email: [""],
      password: [""],
      organization: [""],
      restUrl: [""],
      mqttUrl: [""],
    });

    const pageable = { page: 1, size: 20, sort: "id" };
    this.loraConfigService
      .getAll(pageable)
      .then((loraConfigs: LoraConfig[]) => {
        this.loraConfigs = loraConfigs;
        this.totalRecords = loraConfigs.length / 20;
      });
  }

  get loading$() {
    return of(this.loading).pipe(distinctUntilChanged());
  }

  get loraConfigs$() {
    return of(this.loraConfigs).pipe(distinctUntilChanged());
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLoraConfigs(page: number, size: number, sort?: string) {
    const pageable = { page, size, sort };
    this.loraConfigService
      .getAll(pageable)
      .then((loraConfigs: LoraConfig[]) => {
        this.loraConfigs = loraConfigs;
        this.totalRecords = loraConfigs.length;
        this.loading = false;
      });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loraConfigForm.controls;
  }

  loadLoraConfigsLazy(event: LazyLoadEvent) {
    this.loading = true;
    const sortBy =
      event.sortField === undefined
        ? "id"
        : event.sortField === "role"
        ? "role.name"
        : event.sortField;
    const sortOrder = event.sortOrder === -1 ? "desc" : "asc";
    this.loadLoraConfigs(event.first, event.rows, sortBy + "," + sortOrder);
  }

  save() {
    this.submitted = true;
    this.displayDialog = false;

    // stop here if form is invalid
    if (this.loraConfigForm.invalid) {
      return;
    }

    const loraConfigs = Array.from(this.loraConfigs);
    this.loraConfig = { ...this.loraConfigForm.value };
    this.loraConfigService
      .updateLoraConfig(this.loraConfig)
      .pipe(takeUntil(this.destroy$))
      .subscribe((loraConfig: LoraConfig) => {
        const index = loraConfigs.findIndex((el:LoraConfig) => el.id === loraConfig.id);
        if (index >= 0) {
          loraConfigs[index] = loraConfig;
        }
      });

    this.loraConfigs = loraConfigs;
    this.loraConfig = null;
  }

  onRowSelect(event) {
    this.loraConfig = this.cloneLoraConfig(event.data);
  }

  onRowUnselect(event) {
    this.loraConfig = undefined;
  }

  showDialogToEdit() {
    if (this.loraConfig !== undefined) {
      this.newLoraConfig = false;
      this.submitted = false;
      this.loraConfigForm.patchValue({ ...this.loraConfig });
      this.displayDialog = true;
    }
  }

  restartLoraConnection() {
    this.displayInfoDialogMessage = '';
    this.loraConfigService.restartLoraConnection().then(resp => {
      this.displayInfoDialogMessage = 'Sucessfully restarted connection to LORA application.';
      this.displayInfoDialog = true;
    });
  }

  cloneLoraConfig(c: LoraConfig): LoraConfig {
    const loraConfig = {
      id: undefined,
      loraOn: undefined,
      email: undefined,
      password: undefined,
      organization: undefined,
      restUrl: undefined,
      mqttUrl: undefined,
    };

    for (const prop in c) {
      if (c[prop] !== undefined) {
        loraConfig[prop] = c[prop];
      }
    }

    return loraConfig;
  }
}
