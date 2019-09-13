import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-peers',
  templateUrl: './peers.component.html',
  styleUrls: ['./peers.component.scss']
})
export class PeersComponent implements OnInit {

  peersForm;

  constructor(private formBuilder: FormBuilder) {
    this.peersForm = this.formBuilder.group({
      Peers: this.formBuilder.array([this.formBuilder.control('')])
    });
   }

  ngOnInit() {
  }

  get peers() {
   return this.peersForm.get('Peers') as FormArray;
  }

  addPeer(peer: string) {
    this.peers.push(this.formBuilder.control(''));
  }

}
