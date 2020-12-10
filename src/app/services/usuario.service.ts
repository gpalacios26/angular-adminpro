import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { PaginarUsuario } from '../interfaces/paginar-usuario.interface';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): string {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit() {
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '175736354400-b0p0j013n96bba2t5btodvpc3mj3ncdq.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve(true);
      });
    });
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, this.headers
    ).pipe(map((resp: any) => {
      const { email, google, nombre, role, img = '', uid } = resp.usuario;
      this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
      this.guardarLocalStorage(resp.token, resp.menu);
      return true;
    }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      }));
  }

  actualizarPerfil(data: { nombre: string, email: string, role: string }) {

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm) {

    return this.http.post(`${base_url}/login`, formData)
      .pipe(tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      }));
  }

  loginGoogle(token) {

    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      }));
  }

  cargarUsuarios(desde: number = 0) {

    return this.http.get<PaginarUsuario>(`${base_url}/usuarios?desde=${desde}`, this.headers)
      .pipe(
        map(resp => {
          const usuarios = resp.usuarios.map(user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
          );
          return {
            total: resp.total,
            usuarios: usuarios
          };
        })
      )
  }

  eliminarUsuario(usuario: Usuario) {

    return this.http.delete(`${base_url}/usuarios/${usuario.uid}`, this.headers);
  }

  actualizarUsuario(usuario: Usuario) {

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers);
  }
}
