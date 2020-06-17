import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoryPreviewPage } from './category-preview.page';

describe('CategoryPreviewPage', () => {
  let component: CategoryPreviewPage;
  let fixture: ComponentFixture<CategoryPreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryPreviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
