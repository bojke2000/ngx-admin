import { Component, OnInit } from '@angular/core';

import { AbstractComponent } from '../../AbstractComponent';
import { LogfileService } from '../../service/logfile.service';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

@Component({
  selector: 'ngx-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['./logfile.component.css'],
})
export class LogfileComponent extends AbstractComponent implements OnInit {
  logfile: string[] = undefined;
  activity: string[] = undefined;
  activitySearch: string = undefined;

  constructor(
    private logfileService: LogfileService,
    translate: TranslateService) {
    super(translate);
  }

  get activity$() {
    return of(this.activity);
  }

  ngOnInit(): void {
    this.logfileService.getLogfile().subscribe(logfile => {
      const tempbuf: string[] = (logfile as string).split('\n');
      this.logfile = tempbuf.length <= 2000 ? tempbuf.reverse() : tempbuf.slice(tempbuf.length - 2000).reverse();
      this.activity = this.logfile;
    });
  }

  private filter(): void {
    const {activitySearch, logfile} = this;
    this.activity = activitySearch && activitySearch !== '' ? logfile.filter(line => line.toLowerCase().includes(activitySearch.toLowerCase())) : logfile;
  }

  onActivitySearch(event: any) {
    if (event.keyCode === 13) {
      this.filter();
    }
  }

  onActivitySearchBlur() {
    this.filter();
  }
}
