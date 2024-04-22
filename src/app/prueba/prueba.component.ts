import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-prueba',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './prueba.component.html',
  styleUrl: './prueba.component.css',
})
export default class PruebaComponent implements OnInit, OnDestroy {


  public wsService = inject(WebsocketService);
  public chatService = inject(ChatService);
  texto: string = '';
  mensajesSubscription: Subscription;
  constructor() { }
  ngOnDestroy(): void {
    this.mensajesSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.mensajesSubscription = this.chatService.getMessage().subscribe((msg: any) => {
      console.log(msg);
    });
  }

  enviar() {
    console.log(this.texto);
    this.chatService.sendMessage(this.texto);
    this.texto = "";
  }
}
