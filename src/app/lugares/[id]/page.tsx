"use client";

import { useEffect, useState } from "react";
import { getUsuarios, updateUsuario } from "@/app/users/usuarios.api";
import { Usuario } from "@/app/users/types/usuario.interface";

export default function Columnas() {
  const [admin, setAdmin] = useState<Usuario | null>(null); // Estado para el admin
  const [columna, setColumna] = useState<number | null>(null); // Estado para la columna

  // Obtener usuarios y buscar al admin con CI 0000000000
  useEffect(() => {
    async function fetchAdmin() {
      const usuarios = await getUsuarios();
      // Verifica que los usuarios se están obteniendo
      const adminUsuario = usuarios.find((user: Usuario) => user.ci === "0000000000");
      if (adminUsuario) {
        setAdmin(adminUsuario);
        setColumna(adminUsuario.columna); // Si el admin tiene columna, setéala
      }
    }
    fetchAdmin();
  }, []);

  // Función para manejar el cambio en el input de columna
  const handleColumnaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumna(Number(e.target.value));
  };

  // Función para guardar el cambio de columna
  const handleGuardarColumna = async () => {
    if (admin && columna !== null && columna >= 0) {
      if (columna <= 0) {
        alert("Por favor ingrese un número válido para la columna.");
        return;
      }
  
      const updatedAdmin = {
        ...admin,  // Mantén los datos existentes del admin
        columna,   // Actualiza solo la columna
      };
  
      console.log("Datos enviados al backend:", updatedAdmin); // Imprime los datos para verificar
      console.log("Número de columna enviado:", columna);

      try {
        const response = await updateUsuario(admin.id, updatedAdmin);
        console.log("Columna actualizada:", response);
        alert("Columna actualizada con éxito.");
        setAdmin((prev) => prev ? { ...prev, columna } : null);
      } catch (error) {
        console.error("Error al actualizar la columna:", error);
        alert("Hubo un problema al actualizar la columna.");
      }
    } else {
      alert("Por favor ingrese un valor de columna válido.");
    }
  };
  

  return (
    <div className="p-4">
      {admin ? (
        <>
          <h2 className="text-xl mb-4">Actualizar Columna del Administrador</h2>
          <div className="mb-4">
            <label className="block mb-2">Columna:</label>
            <input
              type="number"
              value={columna !== null ? columna : 0} // Asegúrate de que siempre haya un valor
              onChange={handleColumnaChange}
              className="border p-2 rounded w-32"
              placeholder="Ingrese columna"
            />
          </div>
          <button
            onClick={handleGuardarColumna}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Guardar Columna
          </button>
        </>
      ) : (
        <p>Cargando información del administrador...</p>
      )}
    </div>
  );
}
