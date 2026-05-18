import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppComponent } from './app';
import { AuthService } from './services/auth.service';
import { TiendaService } from './services/tienda.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideTranslateService(),
        { provide: AuthService, useValue: { user$: of(null) } },
        {
          provide: TiendaService,
          useValue: {
            cargarEstado: (): void => {},
            tiendaAbierta: signal(true),
          },
        },
      ],
    }).compileComponents();
  });

  it('deberia crear el componente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
