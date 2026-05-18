import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestauranteComponent } from './restaurantes';

describe('Restaurantes', () => {
  let component: RestauranteComponent;
  let fixture: ComponentFixture<RestauranteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestauranteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
