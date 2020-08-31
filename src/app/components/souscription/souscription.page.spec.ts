import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SouscriptionPage } from './souscription.page';

describe('SouscriptionPage', () => {
  let component: SouscriptionPage;
  let fixture: ComponentFixture<SouscriptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SouscriptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SouscriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
