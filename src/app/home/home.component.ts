import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HomeService } from '../services/home.service';
import { BodyMainComponent } from './components/body-main/body-main.component';
import { HeaderPrincipalComponent } from './components/header-principal/header-principal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HeaderPrincipalComponent,
    BodyMainComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit {
  public router = inject(Router);
  public serviceHome = inject(HomeService);
  public formBuilder = inject(FormBuilder);
  // public wsService = inject(WebsocketService);

  // Es para saber si esta Login o Resgistrado
  // true : Login
  // false: Registro
  public viewOptionsUser = signal(false);

  // Es para tomar encuenta si la persona ya en un pasado entro a la pagina
  // true : indica que la persona tiene la cuenta iniciada
  // false : indica que la persona ni registrado esta o cerro sesion
  // public isLogged = signal(false);

  public titulo: string = "";
  //
  public viewActions = signal(false);

  // MENSAJA DE ALERTA
  public viewMessageAlert = signal(false);
  public messageAlert = signal("");

  // FORMULARIOS
  // Formulario de INICIO SESION
  public myFormLogin: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  // Formulario de REGISTRO
  public myFormRegister: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });
  constructor() {
    if (this.viewOptionsUser()) {
      this.titulo = "Inicio de Sesion";
    } else {
      this.titulo = "Registrese";
    }
  }
  ngOnInit(): void {
    const isValueLocalStorage = localStorage.getItem('isAuthenticaded');
    if (isValueLocalStorage) {
      if (isValueLocalStorage === 'true') {
        this.serviceHome.onChangeIsAuthenticaded(true);
      } else {
        this.serviceHome.onChangeIsAuthenticaded(false);
      }
    } else {
      localStorage.setItem('isAuthenticaded', this.serviceHome.getIsAuthenticaded().toString());
    }
  }

  viewMessage(): boolean {
    return this.viewMessageAlert() && !this.serviceHome.getIsAuthenticaded();
  }

  changeViewMessage(valueNew: boolean): void {
    this.viewMessageAlert.set(valueNew);
  }

  validInitSession(): void {
    this.changeViewMessage(true);
    this.messageAlert.set("Inicie Sesion Por Favor");
  }

  changeViewOptionsUser(): void {
    this.viewOptionsUser.set(!this.viewOptionsUser());
    if (this.viewOptionsUser()) {
      this.titulo = "Inicio de Sesion";
    } else {
      this.titulo = "Registrese";
    }
    console.log(this.viewOptionsUser());
  }

  // METODOS DE LOGIN, REGISTRO Y CERRAR SESION

  onSaveFormLogin(): void {
    const { email, password } = this.myFormLogin.value;
    if (this.myFormLogin.valid) {
      this.serviceHome.loginUsuario(email, password).subscribe((res) => {
        console.log(res);
        this.serviceHome.onChangeIsAuthenticaded(true);
        localStorage.setItem('isAuthenticaded', this.serviceHome.getIsAuthenticaded().toString());
        localStorage.setItem('usuario', JSON.stringify(res));
        this.serviceHome.onChangeviewActions();
        this.myFormLogin.reset();
        // this.router.navigate(['/diagrama']);
        // let usuario: UsuarioResponse;
        // const usuarioData = JSON.parse(localStorage.getItem('usuario'));
        // usuario = Object.assign(new UsuarioResponse(), usuarioData);
      })
    } else {
      this.changeViewMessage(true);
      this.messageAlert.set("Campos Invalidos o Vacios");
    }
  }

  onSaveFormRegister(): void {
    // console.log(this.myFormRegister.value);
    const { email, password, confirmPassword } = this.myFormRegister.value;
    if (this.myFormRegister.valid) {
      if (!(password == confirmPassword)) {
        this.changeViewMessage(true);
        this.messageAlert.set("Verificar igualdad contraseñas");
      } else {
        this.serviceHome.registroUsuario(email, password).subscribe((res) => {
          // console.log(res);
          if (res.ok) {
            this.serviceHome.onChangeIsAuthenticaded(true);
            localStorage.setItem('isAuthenticaded', this.serviceHome.getIsAuthenticaded().toString());
            localStorage.setItem('usuario', JSON.stringify(res));
            this.serviceHome.onChangeviewActions();
            this.myFormRegister.reset();
            // this.router.navigate(['/diagrama']);
          } else {
            console.log(res.ok);
            this.changeViewMessage(true);
            this.messageAlert.set("Ya existe un usuario con ese correo");
          }
        }, (data) => {
          console.log(data.error);
          this.changeViewMessage(true);
          this.messageAlert.set(data.mensaje);
        });
      }
    } else {
      this.changeViewMessage(true);
      this.messageAlert.set("Campos Invalidos o Vacios");
    }
  }

  cerrarSesion(): void {
    this.serviceHome.onChangeIsAuthenticaded(false);
    localStorage.setItem('isAuthenticaded', this.serviceHome.getIsAuthenticaded().toString());
    localStorage.removeItem('usuario');
    this.serviceHome.onChangeviewActions();
  }
}
