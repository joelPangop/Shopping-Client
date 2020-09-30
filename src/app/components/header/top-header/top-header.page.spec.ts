import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TopHeaderPage } from './top-header.page';

describe('TopHeaderPage', () => {
  let component: TopHeaderPage;
  let fixture: ComponentFixture<TopHeaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopHeaderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TopHeaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
