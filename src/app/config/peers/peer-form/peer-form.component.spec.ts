import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerFormComponent } from './peer-form.component';

describe('PeerFormComponent', () => {
  let component: PeerFormComponent;
  let fixture: ComponentFixture<PeerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
