import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;

  public imgSubs: Subscription;

  constructor(
    private medicoService: MedicoService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen.subscribe(resp => this.cargarMedicos());
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe(
      response => {
        this.medicos = response;
        this.cargando = false;
      }
    );
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.cargarMedicos();
    }

    this.busquedasService.buscar('medicos', termino).subscribe(
      (response: any) => {
        this.medicos = response;
      }
    );
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR',
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico.id).subscribe(
          response => {
            Swal.fire('Médico borrado', `${medico.nombre} fue eliminado correctamente`, 'success');
            this.cargarMedicos();
          }
        );
      }
    });
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico.id, medico.img);
  }

}
