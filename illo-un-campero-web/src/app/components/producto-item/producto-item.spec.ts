import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  ProductoItemComponent } from './producto-item';

describe('ProductoItem', () => {
  let component: ProductoItemComponent;
  let fixture: ComponentFixture<ProductoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoItemComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
