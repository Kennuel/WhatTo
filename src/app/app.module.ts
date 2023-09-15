import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LandingComponent} from './landing/landing.component';
import {RoomComponent} from './room/room.component';
import {FormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../environments/environment';
import {ServiceWorkerModule} from '@angular/service-worker';
import {DlComponent} from './dl/dl.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {RouterModule} from '@angular/router';
import {A11yModule} from '@angular/cdk/a11y';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { SubRoomComponent } from './sub-room/sub-room.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RoomComponent,
    DlComponent,
    SubRoomComponent,
  ],
  imports: [
    MatTabsModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    A11yModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
