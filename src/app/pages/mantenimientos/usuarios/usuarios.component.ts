import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public desde: number = 0;
  public cargando: boolean = true;

  public imgSubs: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen.subscribe(resp => this.cargarUsuarios());
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe(
      response => {
        this.totalUsuarios = response.total;
        this.usuarios = response.usuarios;
        this.usuariosTemp = response.usuarios;
        this.cargando = false;
      }
    );
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde = this.desde - valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar('usuarios', termino).subscribe(
      response => {
        this.usuarios = response;
      }
    );
  }

  eliminarUsuario(usuario: Usuario) {

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe(
          response => {
            Swal.fire('Usuario borrado', `${usuario.nombre} fue eliminado correctamente`, 'success');
            this.cargarUsuarios();
          }
        );
      }
    });
  }

  cambiarRole(usuario: Usuario) {

    this.usuarioService.actualizarUsuario(usuario).subscribe(
      (response: any) => {
        if (response.ok !== true) {
          Swal.fire('Error', 'No se pudo actualizar el rol', 'error');
        }
      }
    );
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
