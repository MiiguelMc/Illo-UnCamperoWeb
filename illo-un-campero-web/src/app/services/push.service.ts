import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Web Push (VAPID). Registra el service worker, pide permiso,
 * se suscribe en el navegador y envía la suscripción al backend.
 */
@Injectable({ providedIn: 'root' })
export class PushService {
  private http = inject(HttpClient);
  private API_URL = `${environment.apiUrl}/push`;

  private soportado(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  /** Activa las notificaciones para este dispositivo. Silencioso si falla o no hay soporte. */
  async enablePush(): Promise<void> {
    try {
      if (!this.soportado()) return;

      const registration = await navigator.serviceWorker.register('/push-sw.js');

      if (Notification.permission === 'denied') return;
      if (Notification.permission === 'default') {
        const permiso = await Notification.requestPermission();
        if (permiso !== 'granted') return;
      }

      const { publicKey } = await firstValueFrom(
        this.http.get<{ publicKey: string }>(`${this.API_URL}/public-key`)
      );
      if (!publicKey) return;

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(publicKey),
        });
      }

      await firstValueFrom(
        this.http.post(`${this.API_URL}/subscribe`, subscription.toJSON())
      );
    } catch (e) {
      console.warn('No se pudieron activar las notificaciones push:', e);
    }
  }

  /** Cancela la suscripción de este dispositivo. */
  async disablePush(): Promise<void> {
    try {
      if (!this.soportado()) return;
      const registration = await navigator.serviceWorker.getRegistration('/push-sw.js');
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await firstValueFrom(
          this.http.post(`${this.API_URL}/unsubscribe`, { endpoint: subscription.endpoint })
        );
        await subscription.unsubscribe();
      }
    } catch (e) {
      console.warn('No se pudo desactivar las notificaciones push:', e);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const buffer = new ArrayBuffer(rawData.length);
    const outputArray = new Uint8Array(buffer);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
