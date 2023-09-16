import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import 'firebase/firestore';
import { timer } from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import firebase from 'firebase/compat';
import {MatDialog} from '@angular/material/dialog';
import {SubRoomComponent} from '../sub-room/sub-room.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  room: any;
  room$: any;
  showShare = false;
  tabName = null;

  todoTitle = '';
  lastRooms: any;
  private preventSimpleClick: boolean = false;
  private timer: any;
  todoInEditMode: any;
  editTitle: string = "";

  constructor(
    private auth: AngularFireAuth,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    // @ts-ignore
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
    if (this.room.todos.length === 0) {
      return 0;
    }

    return this.room.todos.filter((x: { checked: boolean; }) => x.checked === true).length / this.room.todos.length;
  }

  checkUser(user: firebase.User | null | undefined) {
    if (!user) {
      this.navigateHome();
    } else {
      this.init();
    }
  }

  init() {
    const roomId = this.activatedRoute.snapshot.paramMap.get('id');
    if (!roomId) {
      this.logout();
    }

    // @ts-ignore
    this.room$ = this.firestore.collection('rooms').doc(roomId)
      .valueChanges()
      .subscribe(room => this.checkRoom(room));
  }

  private checkRoom(room: any) {
    if (!room) {
      this.logout();
    }

    room.todos.sort(this.todoSort);

    this.room = room;
    this.tabName = this.tabName ?? this.room.tabs[0];
    this.lastRooms = this.lastRooms.filter((room: { roomname: any; }) => room.roomname !== this.room.roomname);
    this.lastRooms.slice(9);
    this.lastRooms.unshift({roomname: this.room.roomname, password: this.room.password});
    localStorage.setItem('lastRooms', JSON.stringify(this.lastRooms));
  }

  todoSort(todo1: { checked: any; }, todo2: { checked: any; }) {
    if (todo1.checked === todo2.checked) {
      return 0;
    }
    if (!todo1.checked) {
      return -1;
    }
    return 1;
  }

  navigateHome() {
    this.router.navigate(['']);
  }
  logout() {
    this.auth.signOut().then(() => this.navigateHome());
  }
  check(todo: { checked: boolean; }) {
    this.timer = 0;
    this.preventSimpleClick = false;
    let delay = 200;
    this.timer = setTimeout(() => {
      if(!this.preventSimpleClick){
        todo.checked = !todo.checked;
        this.updateRoom();
      }
    }, delay);


  }

  addTodo() {
    if(this.todoInEditMode != null) {
      this.todoInEditMode.editMode = false;
      this.todoInEditMode.todo = this.editTitle;
      this.editTitle = "";
      this.todoInEditMode = null;
    } else {
      this.room.todos.push({todo: this.todoTitle, checked: false, tabName: this.tabName});
      this.todoTitle = "";
    }
    this.updateRoom();

  }

  private updateRoom() {
    this.firestore.collection("rooms").doc(this.room.roomname).update(this.room).then();
  }

  delete(todo: { todo: any; }) {
   this.room.todos = this.room.todos.filter((x: { todo: any; }) =>  x.todo !== todo.todo)
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
    const currentTodos = this.room.todos.filter((todo:any) => todo.tabName == this.tabName);
    const otherTodos = this.room.todos.filter((todo:any) => todo.tabName != this.tabName);
    moveItemInArray(currentTodos, event.previousIndex, event.currentIndex);
    this.room.todos = [...currentTodos, ...otherTodos];
    this.updateRoom();
  }

  private buildDeeplink(): string {
    return 'https://' + window.location.href.split('/')[2] + '/dl/' + this.room.roomname + '/' + this.room.password;
  }

  editTodo(todo: any) {
    this.preventSimpleClick = true;
    clearTimeout(this.timer);

    if(this.todoInEditMode != null) {
      return;
    }
    todo.editMode = true;
    this.todoInEditMode = todo;
    this.editTitle = todo.todo;
  }

  getTodosForTab() {
    return this.room.todos.filter((todo:any) => (todo.tabName ? todo.tabName : "") == this.tabName);
  }

  getLabelForId(number: any) {
    return this.room.tabs[number] ? this.room.tabs[number]: number;
  }

  dblcickTab() {

  }

  getTabs() {
    return this.room.tabs;
  }

  openDialog() {
    const dialogRef = this.dialog.open(SubRoomComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      this.room.tabs.push(result)
    });
  }

  removeRoom() {
    this.room.todos.filter((todo:any) => (todo.tabName ? todo.tabName : "") == this.tabName).forEach((todo: any) => this.delete(todo));
    this.room.tabs = this.room.tabs.filter((e:any) => e !== this.tabName);
    this.tabName = null;
    this.updateRoom();
  }
}
