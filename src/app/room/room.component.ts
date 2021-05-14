import { Todo } from './../model/Todo';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, initializeApp } from 'firebase/app';
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore'
import { timer } from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  room;
  room$;
  showShare = false;

  todoTitle = "";
  lastRooms;

  constructor(
    private auth: AngularFireAuth,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.lastRooms = JSON.parse(localStorage.getItem('lastRooms')) || [];
    this.auth.authState.pipe(first())
      .toPromise().then(user => this.checkUser(user));
  }

  ngOnDestroy(): void {
    if (this.room$) {
      this.room$.unsubscribe();
      this.room$ = null;
    }
  }

  calcProgress() {
    if(this.room.todos.length == 0)
      return 0;
    
    return this.room.todos.filter(x => x.checked == true).length / this.room.todos.length;
  }

  checkUser(user) {
    if (!user) {
      this.navigateHome()
    } else {
      this.init()
    }
  }

  init() {
    const roomId = this.activatedRoute.snapshot.paramMap.get("id");
    if (!roomId) {
      this.logout();
    }

    this.room$ = this.firestore.collection("rooms").doc(roomId).valueChanges().subscribe(room => this.checkRoom(room));
  }

  private checkRoom(room: any) {
    if (!room) {
      this.logout();
    }
    
    room.todos.sort(this.todoSort)

    this.room = room;    
    this.lastRooms = this.lastRooms.filter(room => room.roomname != this.room.roomname);
    this.lastRooms.slice(9);
    this.lastRooms.unshift({roomname: this.room.roomname, password: this.room.password})
    localStorage.setItem('lastRooms', JSON.stringify(this.lastRooms));
  }

  todoSort(todo1, todo2) {
    if (todo1.checked == todo2.checked) {
      return 0;
    }
    if (!todo1.checked) {
      return -1;
    }
    return 1;
  }

  navigateHome() {
    this.router.navigate([""]);
  }
  logout() {
    this.auth.signOut().then(() => this.navigateHome());
  }
  check(todo) {
    todo.checked = !todo.checked;
    this.updateRoom();
  }

  addTodo() {
    this.room.todos.push({todo: this.todoTitle, checked: false});
    this.todoTitle = "";
    this.updateRoom();
  }

  private updateRoom() {
    this.firestore.collection("rooms").doc(this.room.roomname).update(this.room).then();
  }

  delete(todo) {
   this.room.todos = this.room.todos.filter(x =>  x.todo !== todo.todo)
   this.updateRoom();
  }

  toogleShowShare() {
    this.showShare = true;
    timer(5000).pipe(first()).subscribe(() => this.showShare = false)
    this.copy();
  }

  copy() {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.buildDeeplink();
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.room.todos, event.previousIndex, event.currentIndex);
    this.updateRoom();
  }

  private buildDeeplink(): string {
    return "https://" + window.location.href.split("/")[2] + "/dl/" + this.room.roomname + "/" + this.room.password;
  }
}
