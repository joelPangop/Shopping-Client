import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommandeViewPage } from './commande-view.page';

describe('CommandeViewPage', () => {
  let component: CommandeViewPage;
  let fixture: ComponentFixture<CommandeViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandeViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommandeViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
