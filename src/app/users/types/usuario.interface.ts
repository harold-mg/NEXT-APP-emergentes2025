export interface Usuario {
    id: string;  // Cambiar de number a string
    nombres: string;
    apellidoP: string;
    apellidoM: string;
    ci: string;
    telefono: string;
    direccion: string;
    antiguedad: number;
    fila: number | null;
    columna: number | null;
    foto: string | null;
    rol: "ADMIN" | "INSTRUCTOR" | "FRATERNO"; // Especificar los posibles roles
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}
