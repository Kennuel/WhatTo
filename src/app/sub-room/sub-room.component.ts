import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-sub-room',
  templateUrl: './sub-room.component.html',
  styleUrls: ['./sub-room.component.css']
})
export class SubRoomComponent implements OnInit {

  public roomname = "";

  constructor(
    public dialogRef: MatDialogRef<SubRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}
