import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainCommerceEditComponent } from './chain-commerce-edit.component';

describe('ChainCommerceEditComponent', () => {
  let component: ChainCommerceEditComponent;
  let fixture: ComponentFixture<ChainCommerceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChainCommerceEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainCommerceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
