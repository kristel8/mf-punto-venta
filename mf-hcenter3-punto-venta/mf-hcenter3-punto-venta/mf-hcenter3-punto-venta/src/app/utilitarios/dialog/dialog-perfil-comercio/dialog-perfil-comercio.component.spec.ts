import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPerfilComercioComponent } from './dialog-perfil-comercio.component';

describe('DialogPerfilComercioComponent', () => {
  let component: DialogPerfilComercioComponent;
  let fixture: ComponentFixture<DialogPerfilComercioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPerfilComercioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPerfilComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
