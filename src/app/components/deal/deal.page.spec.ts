import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DealPage } from './deal.page';

describe('DealPage', () => {
  let component: DealPage;
  let fixture: ComponentFixture<DealPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DealPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
