import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HotDealsPage } from './hot-deals.page';

describe('HotDealsPage', () => {
  let component: HotDealsPage;
  let fixture: ComponentFixture<HotDealsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotDealsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HotDealsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
