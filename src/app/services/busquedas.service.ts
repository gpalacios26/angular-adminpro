import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(
    private http: HttpClient
  ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformartUsuarios(resultados: any[]): Usuario[] {

    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }

  private transformartMedicos(resultados: any[]): Medico[] {

    return resultados.map(
      medico => new Medico(medico.nombre, medico.id, medico.img, medico.usuario, medico.hospital)
    );
  }

  private transformartHospitales(resultados: any[]): Hospital[] {

    return resultados.map(
      hospital => new Hospital(hospital.nombre, hospital.id, hospital.img, hospital.usuario)
    );
  }

  buscar(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    termino: string
  ) {

    return this.http.get<any>(`${base_url}/todo/coleccion/${tipo}/${termino}`, this.headers)
      .pipe(
        map((resp: any) => {
          switch (tipo) {
            case 'usuarios':
              return this.transformartUsuarios(resp.resultados);
            case 'medicos':
              return this.transformartMedicos(resp.resultados);
            case 'hospitales':
              return this.transformartHospitales(resp.resultados);
            default:
              return [];
          }
        })
      );
  }
}
