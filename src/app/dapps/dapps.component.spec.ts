import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DAppsComponent } from './dapps.component';

describe('DappsComponent', () => {
  let component: DAppsComponent;
  let fixture: ComponentFixture<DAppsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
