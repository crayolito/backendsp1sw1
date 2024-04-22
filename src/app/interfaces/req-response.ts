// Generated by https://quicktype.io

export interface UsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: Support;
}

export interface UserResponse {
  data: User;
  support: Support;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface Support {
  url: string;
  text: string;
}

export interface UsuarioResponse {
  usuario: Usuario;
  ok: boolean;
}

export interface Usuario {
  email: string;
  password: string;
}



