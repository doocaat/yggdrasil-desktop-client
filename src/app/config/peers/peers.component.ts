import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormArray } from "@angular/forms";
import { YggdrasilConfig } from "../type/yggdrasil.config";
import { YggdrasilService } from "../../yggdrasil/yggdrasil.service";
import { Peer } from "../../yggdrasil/type/peer";
import { MatDialog } from "@angular/material";
import { PeerFormComponent } from "./peer-form/peer-form.component";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ConfigService } from "../config.service";

@Component({
  selector: "app-peers",
  templateUrl: "./peers.component.html",
  styleUrls: ["./peers.component.scss"]
})
export class PeersComponent implements OnInit, OnDestroy {
  peersForm;
  peerList = new Map<string, Peer>();

  readonly peerSelf = "(self)";

  openedPeer = null;

  reloadPeerInterval$ = interval(1000);

  destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private readonly dialog: MatDialog,
    public readonly yggdrasilService: YggdrasilService,
    public readonly configService: ConfigService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.peersForm = this.formBuilder.group({
      Peers: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.loadPeers();
    this.reloadPeerInterval$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadPeers());

    this.configService.loadYggdrasilConfig();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPeers() {
    this.yggdrasilService.getPeers().subscribe(out => {
      this.peerList.clear();
      Object.keys(out).forEach(key => {
        this.peerList.set(key, out[key]);
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  isPeerConnected(endpoint: string): boolean {
    const item = this.findByEndpointConnectedPeer(endpoint);
    return !!item;
  }

  findByEndpointConnectedPeer(endpoint: string): Peer {
    return Array.from(this.peerList.values()).find(
      item => item.endpoint.trim() === endpoint.trim()
    );
  }

  isEndpointPeerList(endpoint: string): boolean {
    const findItem = this.configService.yggdrasilConfig.Peers.find(
      item => item.trim() === endpoint.trim()
    );

    return !!findItem;
  }

  openPeer(peer: string) {
    this.openedPeer = peer;
  }

  closePeer() {
    this.openedPeer = null;
  }

  disconnectPeer(endpoint: string) {
    const peer = this.findByEndpointConnectedPeer(endpoint);

    if (!!peer) {
      this.yggdrasilService.removePeer(peer.port).subscribe(item => {
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  openConnectedPeerDialog(): void {
    const dialogRef = this.dialog.open(PeerFormComponent, {
      width: "250px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.yggdrasilService.addPeer(result.trim());
        this.loadPeers();
      }
    });
  }

  openAddPeerDialog(): void {
    const dialogRef = this.dialog.open(PeerFormComponent, {
      width: "250px"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.addPeerToList(result);
      }
    });
  }

  addPeerToList(endpoint: string) {
    const yggdrasilConfig = { ...this.configService.yggdrasilConfig };
    const Peers = yggdrasilConfig.Peers.map(item => item);

    Peers.push(endpoint.trim());

    this.configService.saveYggdrasilConfig({...yggdrasilConfig, Peers});
  }

  deletePeer(peer: string) {
    const yggdrasilConfig = { ...this.configService.yggdrasilConfig };
    const Peers = yggdrasilConfig.Peers.map(item => item);

    const index = Peers.findIndex(d => d === peer); // find index in your array
    if (index > -1) {
      Peers.splice(index, 1);

      this.configService.saveYggdrasilConfig({...yggdrasilConfig, Peers});
    }
  }

  trackByFn(index, item) {
    return item.key; // or item.id
  }
}
