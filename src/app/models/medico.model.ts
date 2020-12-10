import { Hospital } from "./hospital.model";

interface _MedicoUser {
    id: string;
    nombre: string;
    img: string;
}

export class Medico {

    constructor(
        public nombre: string,
        public id?: string,
        public img?: string,
        public usuario?: _MedicoUser,
        public hospital?: Hospital
    ) { }
}