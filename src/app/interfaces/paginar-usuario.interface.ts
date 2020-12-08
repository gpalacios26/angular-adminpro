import { Usuario } from '../models/usuario.model';

export interface PaginarUsuario {
    total: number;
    usuarios: Usuario[]
}