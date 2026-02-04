import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carta } from './carta';

describe('Carta', () => {
  let component: Carta;
  let fixture: ComponentFixture<Carta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
