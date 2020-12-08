import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    {
      titulo: 'Dahboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/dashboard' },
        { titulo: 'Progress Bar', url: '/dashboard/progress' },
        { titulo: 'Gráficas', url: '/dashboard/grafica1' },
        { titulo: 'Promesas', url: '/dashboard/promesas' },
        { titulo: 'Rxjs', url: '/dashboard/rxjs' }
      ]
    },
    {
      titulo: 'Mantenimientos',
      icono: 'mdi mdi-folder-lock-open',
      submenu: [
        { titulo: 'Usuarios', url: '/dashboard/usuarios' },
        { titulo: 'Hospitales', url: '/dashboard/hospitales' },
        { titulo: 'Médicos', url: '/dashboard/medicos' }
      ]
    }
  ];

  constructor() { }
}
