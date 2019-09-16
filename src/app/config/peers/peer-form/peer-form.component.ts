import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-peer-form',
  templateUrl: './peer-form.component.html',
  styleUrls: ['./peer-form.component.scss']
})
export class PeerFormComponent implements OnInit {

  public peer = '';

  constructor(public dialogRef: MatDialogRef<PeerFormComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
