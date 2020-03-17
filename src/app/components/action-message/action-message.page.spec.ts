import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActionMessagePage } from './action-message.page';

describe('ActionMessagePage', () => {
  let component: ActionMessagePage;
  let fixture: ComponentFixture<ActionMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionMessagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
