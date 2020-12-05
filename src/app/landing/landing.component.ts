import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore'
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],

})
export class LandingComponent implements OnInit {

  roomname: string = "";
  password: string = "";
  carousel = ['full-stack developer.','ui/ux designer.', 'blogger.'];
  loading = false;
  lastRooms;
  
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.loading = false;
    
    this.lastRooms = JSON.parse(localStorage.getItem('lastRooms')) || [];
  
    window.onload(null);
    this.auth.user.pipe(first()).toPromise().then(
      user => this.checkUser(user)
    )
  }

  checkUser(user) {
    if(user) {
      const roomId = user.email.split("@")[0];
      this.router.navigate(["/room/" + roomId]);
    }
  }
  enterroom() {
    this.loading = true;
    const roomname = this.buildRoomname();
    this.auth.createUserWithEmailAndPassword(roomname, this.password)
      .then(() => this.handleRoomCreation())
      .catch (errorResponse => this.handleErrorResponse(errorResponse));
  }

  private buildRoomname() {
    return this.roomname + '@whatto.web.app';
  }

  handleRoomCreation() {
    this.firestore.collection('rooms').doc(this.roomname).set({
      roomname: this.roomname,
      password: this.password,
      todos: []
    }).then(() => this.router.navigate(["/room/" + this.roomname]))
  }

  handleErrorResponse(errorResponse) { 
    if(errorResponse.code  === "auth/email-already-in-use") {
      this.auth.signInWithEmailAndPassword(this.buildRoomname(), this.password)
      .then(() => this.router.navigate(["/room/" + this.roomname]))
      .catch(() => console.error("Room exists and Password is wrong!"))
      .finally(() => this.loading = false)
    } else {
      //TODO: Check for pswd to short
      console.error("ROOM could not be created")
    }
  }

  connectToRoom(room) {
    this.roomname = room.roomname;
    this.password = room.password;
    this.enterroom();
  }
}
