import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;

  public imgSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen.subscribe(resp => this.cargarHospitales());
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(
      response => {
        this.hospitales = response;
        this.cargando = false;
      }
    );
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.cargarHospitales();
    }

    this.busquedasService.buscar('hospitales', termino).subscribe(
      (response: any) => {
        this.hospitales = response;
      }
    );
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital.id, hospital.nombre).subscribe(
      response => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      }
    );
  }

  eliminarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital.id).subscribe(
      response => {
        this.cargarHospitales();
        Swal.fire('Borrado', hospital.nombre, 'success');
      }
    );
  }

  async abrirSweetAlert() {
    const { isConfirmed, value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      input: 'text',
      inputLabel: 'Ingrese el nombre del nuevo hospital',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ACEPTAR',
      cancelButtonText: 'CANCELAR',
    });

    if (isConfirmed) {
      if (value.trim().length > 0) {
        this.hospitalService.crearHospital(value).subscribe(
          response => {
            this.cargarHospitales();
            Swal.fire('Creado', value, 'success');
          }
        );
      } else {
        Swal.fire('Error', 'Debe ingresar el nombre del hospital', 'error');
      }
    }
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital.id, hospital.img);
  }

}
