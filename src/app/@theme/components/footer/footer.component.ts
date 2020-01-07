import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by"><b><a href="mailto:bzivkovic@gmail.com" target="_blank">INSA</a></b> 2019</span>
  `,
})
export class FooterComponent {
}
