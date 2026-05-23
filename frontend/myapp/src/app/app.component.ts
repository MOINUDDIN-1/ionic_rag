import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [HttpClientModule, IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
