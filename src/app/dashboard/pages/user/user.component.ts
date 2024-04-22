import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { UsersService } from '../../../services/users.service';
import { TitleComponent } from '../../../shared/title/title.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, TitleComponent],
  template: `
    <app-title [title]="titleLabel()" />

    @if(user()){
    <section>
      <img [srcset]="user()!.avatar" [alt]="user()!.first_name" />
      <div>
        <h3>{{ user()?.first_name }} {{ user()?.last_name }}</h3>
        <p>{{ user()?.email }}</p>
      </div>
    </section>
    }@else {
    <p>Cargando Informacion ....</p>
    }
  `,
})
export default class UserComponent {
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  // public user = signal<User | undefined>(undefined);
  public titleLabel = computed(() => {
    if (this.user()) {
      return `Informacion del usuario ${this.user()?.first_name} ${this.user()?.last_name
        }`;
    }

    return 'Cargando Informacion ....';
  });

  public user = toSignal(
    this.route.params.pipe(
      switchMap(({ id }) => this.usersService.getUserById(id))
    )
  );
  constructor() {
    // this.route.params.subscribe((params) => {
    //   console.log({params});
    // });
  }
}
