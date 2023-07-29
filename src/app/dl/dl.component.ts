import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs/operators';
import firebase from 'firebase/compat';

@Component({
  selector: 'app-dl',
  templateUrl: './dl.component.html',
  styleUrls: ['./dl.component.css']
})
export class DlComponent implements OnInit {

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private activeRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.auth.user.pipe(first()).toPromise().then(
      user => this.checkUser(user)
    )
  }

  checkUser(user: firebase.User | null | undefined) {
    if(user) {
      this.auth.signOut().then(
        () => this.connectToRoom()
      );
    }
    this.connectToRoom();
  }

  connectToRoom() {
    const roomId = this.activeRoute.snapshot.paramMap.get("id");
    const paswd = this.activeRoute.snapshot.paramMap.get("pswd");
    if(!roomId || ! paswd) {
      this.router.navigate([""]);
    }

    if (paswd != null) {
      this.auth.signInWithEmailAndPassword(this.buildRoomname(roomId), paswd)
        .then(() => this.router.navigate(["/room/" + roomId]));
    }
  }
  private buildRoomname(roomId: string | null) {
    return roomId + '@whatto.web.app';
  }
}
