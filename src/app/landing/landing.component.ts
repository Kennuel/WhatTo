import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import 'firebase/firestore'
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
  carousel = [ "do.",
                            "learn.",
                            "buy.",
                            "explore.",
                            "play.",
                            "achieve.",
                            "make.",
                            "begin.",
                            "write.",
                            "draw.",
                            "avoid.",
                            "pay.",
                            "learn.",
                            "create.",
                            "repair",
                            "add.",
                            "order.",
                            "solve.",
                            "remember.",
                            "end.",
                            "ask.",
                            "bring.",
                            "propose",
                            "cook.",
                            "teach.",
                            "visit.",
                            "give.",
                            "install."];
  loading = false;
  lastRooms: any;
  errorMessage = "";

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.loading = false;

    this.lastRooms = (JSON.parse(localStorage.getItem('lastRooms') as any) || []) as any;

    // @ts-ignore
    window.onload(null);
    this.auth.user.pipe(first()).toPromise().then(
        (user: any) => this.checkUser(user)
    )
  }

  checkUser(user: { email: string; }) {
    if (user) {
      const roomId = user.email.split("@")[0];
      this.router.navigate(["/room/" + roomId]);
    }
  }

  enterroom() {
    this.loading = true;
    const roomname = this.buildRoomname();
    this.auth.createUserWithEmailAndPassword(roomname, this.password)
      .then(() => this.handleRoomCreation())
      .catch((errorResponse: any) => this.handleErrorResponse(errorResponse));
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

  handleErrorResponse(errorResponse: { code: string; }) {
    if (errorResponse.code === "auth/email-already-in-use") {
      this.auth.signInWithEmailAndPassword(this.buildRoomname(), this.password)
        .then(() => this.router.navigate(["/room/" + this.roomname]))
        .catch((error: any) => this.displayError(error));
    } else {
      this.displayError(errorResponse);
    }
  }

  displayError(errorResponse: { code?: string; message?: any; }) {
    console.error(errorResponse.message)
    this.errorMessage = errorResponse.message.replace("user", "room");
    this.loading = false;
  }


  connectToRoom(room: { roomname: string; password: string; }) {
    this.roomname = room.roomname;
    this.password = room.password;
    this.enterroom();
  }
}
