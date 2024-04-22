import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Usuario, UsuarioResponse } from '../interfaces/req-response';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  usuarioAUX: Usuario = {
    email: '',
    password: ''
  };
  private http = inject(HttpClient);
  public viewActions = signal(false);
  public usuarioAuth = signal<Usuario>(this.usuarioAUX);
  // Es para tomar encuenta si la persona ya en un pasado entro a la pagina
  // true : indica que la persona tiene la cuenta iniciada
  // false : indica que la persona ni registrado esta o cerro sesion
  public isAuthenticaded = signal(false);


  public onChangeIsAuthenticaded(value: boolean): void {
    this.isAuthenticaded.set(value);
  }

  public getIsAuthenticaded(): boolean {
    return this.isAuthenticaded();
  }

  public onChangeviewActions(): void {
    this.viewActions.set(!this.viewActions());
  }
  public getViewActions(): boolean {
    return this.viewActions();
  }

  public registroUsuario(email: string, password: string) {
    return this.http.post<UsuarioResponse>('http://localhost:5000/auth/registre',
      {
        email,
        password
      }
    );
  }

  public loginUsuario(email: string, password: string) {
    return this.http.post<UsuarioResponse>('http://localhost:5000/auth/login',
      {
        email,
        password
      }
    );
  }
}
