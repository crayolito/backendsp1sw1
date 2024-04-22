import { inject, Injectable, signal } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socketStatus = signal(false);
  public socket: Socket = inject(Socket);
  constructor(
  ) {
    this.checkStatus();
  }

  checkStatus(): void {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus.set(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus.set(false);
    });
  }

  // Emitir un evento para el servidor
  emit(evento: string, payload?: any, callback?: Function): void {
    // payload : data
    // callback : para usarlo debe mandar un payload y es la funcion que se
    // ejecutar despues que se realize este trabajo
    // emit('EVENTO', payload, callback)
    this.socket.emit(evento, payload, callback);
  }


  // Escuchar cualquier evento que emita el servidor
  listen(evento: string): any {
    return this.socket.fromEvent(evento);
  }
}
