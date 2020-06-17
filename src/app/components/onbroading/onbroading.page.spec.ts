import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnbroadingPage } from './onbroading.page';

describe('OnbroadingPage', () => {
  let component: OnbroadingPage;
  let fixture: ComponentFixture<OnbroadingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnbroadingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnbroadingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
