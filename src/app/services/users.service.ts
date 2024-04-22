import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { delay, map } from 'rxjs';
import { User, UserResponse, UsersResponse } from '../interfaces/req-response';

interface State {
  users: User[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  #state = signal<State>({
    users: [],
    loading: true,
  });

  public users = computed(() => this.#state().users);
  public loading = computed(() => this.#state().loading);

  constructor() {
    // console.log('Cargando usuarios...');
    this.http
      .get<UsersResponse>('https://reqres.in/api/users')
      .pipe(delay(2000))
      .subscribe((res) => {
        this.#state.set({
          loading: true,
          users: res.data,
        });
      });
  }

  getUserById(id: String) {
    return this.http.get<UserResponse>(`https://reqres.in/api/users/${id}`).pipe(
      delay(2000),
      map((res) => res.data)
    );
  }
}
