import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { RoomComponent } from './room/room.component';
import { FormsModule } from '@angular/forms'
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DlComponent } from './dl/dl.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    RoomComponent,
    DlComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DragDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
