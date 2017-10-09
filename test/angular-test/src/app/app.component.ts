import { Component } from '@angular/core';
import Prajna from 'prajna';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';

    ngOnInit() {
        console.log(Prajna);
    }
}
