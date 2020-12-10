import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado: Medico;
  public hospitalSeleccionado: Hospital;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges.subscribe(
      hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(h => h.id === hospitalId);
      }
    );
  }

  cargarMedico(id: string) {
    this.medicoService.obtenerMedicoPorId(id)
    .pipe(
      delay(100)
    )
    .subscribe(
      response => {
        if (!response) {
          Swal.fire('Error', 'El médico ingresado no existe', 'error');
          this.router.navigateByUrl('/dashboard/medicos');
        } else {
          this.medicoSeleccionado = response;
          const nombre = response.nombre;
          const hospitalId = response.hospital._id;
          this.medicoForm.setValue({
            nombre: nombre,
            hospital: hospitalId
          });
        }
      },
      error => {
        console.log(error);
        Swal.fire('Error', 'El médico ingresado no existe', 'error');
        this.router.navigateByUrl('/dashboard/medicos');
      }
    );
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe(
      response => {
        this.hospitales = response;
      }
    );
  }

  guardarMedico() {
    if (this.medicoSeleccionado) {
      // Actualizar Médico
      const dataForm = {
        ...this.medicoForm.value,
        id: this.medicoSeleccionado.id
      };
      this.medicoService.actualizarMedico(dataForm).subscribe(
        response => {
          Swal.fire('Actualizado', 'Médico actualizado correctamente', 'success');
          this.router.navigateByUrl('/dashboard/medicos');
        }
      );
    } else {
      // Crear Médico
      this.medicoService.crearMedico(this.medicoForm.value).subscribe(
        response => {
          Swal.fire('Creado', 'Médico creado correctamente', 'success');
          this.router.navigateByUrl('/dashboard/medicos');
        }
      );
    }
  }

}
