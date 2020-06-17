import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowCatOptionPage } from './show-cat-option.page';

describe('ShowCatOptionPage', () => {
  let component: ShowCatOptionPage;
  let fixture: ComponentFixture<ShowCatOptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCatOptionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowCatOptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
