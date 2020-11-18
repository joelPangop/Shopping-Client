import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankViewPage } from './bank-view.page';

describe('BankViewPage', () => {
  let component: BankViewPage;
  let fixture: ComponentFixture<BankViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
