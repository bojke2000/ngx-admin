import { Component, OnInit } from '@angular/core';

import { AbstractComponent } from '../../AbstractComponent';
import { LogfileService } from '../../service/logfile.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['./logfile.component.css'],
})
export class LogfileComponent extends AbstractComponent implements OnInit {
  logfile: string[] = undefined;

  constructor(
    private logfileService: LogfileService,
    translate: TranslateService) {
    super(translate);
  }

  ngOnInit(): void {
    this.logfileService.getLogfile().subscribe(logfile => {
      let tempbuf: string[] = (logfile as string).split('\n');
      this.logfile = tempbuf.length <= 2000 ? tempbuf.reverse() : tempbuf.slice(tempbuf.length - 2000).reverse();
      tempbuf = [];
    });
  }

}
