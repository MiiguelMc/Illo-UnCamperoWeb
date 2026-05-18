import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { environment } from '../../environments/environment';

interface SeoData {
  title: string;
  description: string;
  path: string;
  image?: string;
  robots?: string;
  keywords?: string;
}

const DEFAULT_SEO: SeoData = {
  title: 'Illo Un Campero | Camperos malagueños a domicilio en Teatinos',
  description:
    'Pide camperos malagueños, entrantes, bebidas y postres en Teatinos, Málaga. Carta online de Illo Un Campero, entrega rápida y seguimiento del pedido.',
  path: '/restaurantes',
  image: '/assets/LogoFondoBlanco.webp',
  robots: 'index, follow, max-image-preview:large',
  keywords:
    'camperos Teatinos, campero malagueño, comida a domicilio Málaga, Illo Un Campero, carta camperos',
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly siteUrl = environment.siteUrl.replace(/\/$/, '');

  init(): void {
    this.apply(DEFAULT_SEO);
    this.addGlobalStructuredData();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route) => route.data),
      )
      .subscribe((data) => this.apply({ ...DEFAULT_SEO, ...data['seo'] }));
  }

  private apply(seo: SeoData): void {
    const canonicalUrl = `${this.siteUrl}${seo.path}`;
    const imageUrl = `${this.siteUrl}${seo.image ?? DEFAULT_SEO.image}`;

    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'robots', content: seo.robots ?? DEFAULT_SEO.robots ?? 'index, follow' });
    this.meta.updateTag({ name: 'keywords', content: seo.keywords ?? DEFAULT_SEO.keywords ?? '' });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
    this.setCanonical(canonicalUrl);
    this.setJsonLd('illo-breadcrumb-schema', this.createBreadcrumbSchema(seo));
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }

  private addGlobalStructuredData(): void {
    this.setJsonLd('illo-organization-schema', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${this.siteUrl}/#organization`,
      name: 'Illo Un Campero',
      url: this.siteUrl,
      logo: `${this.siteUrl}/assets/LogoHeader.webp`,
      email: 'info@illouncampero.es',
      telephone: '+34600000000',
      sameAs: ['https://instagram.com', 'https://tiktok.com'],
    });

    this.setJsonLd('illo-website-schema', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.siteUrl}/#website`,
      url: this.siteUrl,
      name: 'Illo Un Campero',
      inLanguage: 'es-ES',
      publisher: { '@id': `${this.siteUrl}/#organization` },
    });

    this.setJsonLd('illo-restaurant-schema', {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      '@id': `${this.siteUrl}/#restaurant`,
      name: 'Illo Un Campero',
      url: this.siteUrl,
      image: `${this.siteUrl}/assets/LogoFondoBlanco.webp`,
      logo: `${this.siteUrl}/assets/LogoHeader.webp`,
      description:
        'Restaurante de camperos malagueños a domicilio en Teatinos, Málaga, con carta online, entrantes, bebidas y postres.',
      servesCuisine: ['Camperos malagueños', 'Bocadillos', 'Comida rápida'],
      priceRange: '€',
      telephone: '+34600000000',
      email: 'info@illouncampero.es',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle Camperos, 21',
        addressLocality: 'Málaga',
        addressRegion: 'Málaga',
        postalCode: '29010',
        addressCountry: 'ES',
      },
      areaServed: ['Teatinos', 'Colonia Santa Inés', 'Universidad de Málaga'],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '12:00',
          closes: '23:30',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '12:00',
          closes: '00:30',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Sunday',
          opens: '13:00',
          closes: '23:00',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '127',
      },
      potentialAction: {
        '@type': 'OrderAction',
        target: `${this.siteUrl}/carta`,
      },
    });
  }

  private createBreadcrumbSchema(seo: SeoData): object {
    const currentName =
      seo.path === '/carta'
        ? 'Carta'
        : seo.path === '/privacidad'
          ? 'Privacidad'
          : seo.path === '/contacto'
            ? 'Contacto'
            : seo.path === '/aviso-legal'
              ? 'Aviso legal'
              : 'Inicio';
    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: `${this.siteUrl}/restaurantes`,
      },
    ];

    if (seo.path !== '/restaurantes') {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: currentName,
        item: `${this.siteUrl}${seo.path}`,
      });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };
  }

  private setJsonLd(id: string, data: object): void {
    this.document.getElementById(id)?.remove();
    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}
