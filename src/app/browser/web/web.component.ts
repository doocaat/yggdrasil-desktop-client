import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.scss']
})
export class WebComponent implements OnInit, AfterViewInit {

  iFrameUrl = 'http://mesh.ygg';

  input = this.iFrameUrl;

  @ViewChild('webview', { static: false }) webview: ElementRef;

  constructor(private zone: NgZone) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getWebview().addEventListener('did-navigate-in-page', (event) => {
      this.zone.run(() => {
        this.input = event.url;
      });
    });
  }

  getWebview() {
    const webview = this.webview.nativeElement as any;
    return webview;
  }

  toToUrl() {
    this.iFrameUrl = this.input;
  }

  reloadView() {
    this.getWebview().reload();
  }

  openDevTool() {
    this.getWebview().openDevTools();
  }

  closeDevTool() {
    this.getWebview().closeDevTools();
  }

  backView() {
    this.getWebview().goBack();
  }

  forwardView() {
    this.getWebview().goForward();
  }

}
