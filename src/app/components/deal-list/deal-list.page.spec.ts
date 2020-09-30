import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DealListPage } from './deal-list.page';

describe('DealListPage', () => {
  let component: DealListPage;
  let fixture: ComponentFixture<DealListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DealListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
