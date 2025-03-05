"use client";

import { useEffect, useState } from "react";
import { getUsuarios, deleteUsuario } from "@/app/users/usuarios.api";
import { Usuario } from "@/app/users/types/usuario.interface";
import { useRouter } from "next/navigation";

export default function VerUsuarios() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const data = await getUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    }

    fetchUsuarios();
  }, []);

  const handleEliminar = async (id: string) => { // id ahora es string
    try {
      await deleteUsuario(id);
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Lista de Usuarios</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">CI</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Dirección</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
                <tr key={usuario.id} className={`border ${usuario.rol === 'ADMIN' ? 'bg-red-100' : usuario.rol === 'INSTRUCTOR' ? 'bg-blue-100' : 'bg-green-100'}`}>
                <td className="border p-2">{usuario.nombres} {usuario.apellidoP} {usuario.apellidoM}</td>
                <td className="border p-2">{usuario.ci}</td>
                <td className="border p-2">{usuario.telefono}</td>
                <td className="border p-2">{usuario.direccion}</td>
                <td className="border p-2">{usuario.rol}</td>
                <td className="border p-2 flex space-x-2">
                  <button
                    onClick={() => router.push(`/users/${usuario.id}/editar`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(usuario.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center p-4">No hay usuarios registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
