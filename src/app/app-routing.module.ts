import { DlComponent } from './dl/dl.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { RoomComponent } from './room/room.component';



const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'room/:id', component: RoomComponent },
  { path: 'dl/:id/:pswd', component: DlComponent },
  { path: '**', component: LandingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
