import { inject, Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public wsService = inject(WebsocketService);
  constructor() { }

  sendMessage(mensaje: string) {
    const payload = {
      de: 'Jorge',
      cuerpo: mensaje
    };
    this.wsService.emit('mensaje', payload);
  }

  getMessage() {
    return this.wsService.listen('mensaje-nuevo');
  }
}
