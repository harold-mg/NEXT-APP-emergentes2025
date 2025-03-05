"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUsuario, updateUsuario } from "@/app/users/usuarios.api";
import { Usuario } from "@/app/users/types/usuario.interface";

export default function EditarUsuario() {
  const router = useRouter();
  const { id } = useParams();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);
  useEffect(() => {
    async function fetchUsuario() {
      if (!id) return;
      try {
        const data = await getUsuario(id as string);
        setUsuario(data);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsuario();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUsuario((prev) =>
      prev ? { ...prev, [name]: name === "antiguedad" || name === "columna" ? Number(value) : value } : prev
    );
  };
  

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario((prev) => prev ? { ...prev, activo: e.target.value === "true" } : prev);
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
  
    const usuarioActualizado = {
      nombres: usuario.nombres,
      apellidoP: usuario.apellidoP,
      apellidoM: usuario.apellidoM,
      ci: usuario.ci,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      antiguedad: usuario.antiguedad,
      columna: usuario.columna,
      activo: usuario.activo,
      rol: usuario.rol,
    };
  
    console.log("Datos enviados al backend:", usuarioActualizado);
  
    try {
      await updateUsuario(id as string, usuarioActualizado);
      router.push("/principal");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };
  
  

  if (loading) return <p>Cargando...</p>;
  if (!usuario) return <p>No se encontró el usuario.</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nombres" placeholder="Nombre" value={usuario.nombres} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="apellidoP" placeholder="Apellido Paterno" value={usuario.apellidoP} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="apellidoM" placeholder="Apellido Materno" value={usuario.apellidoM} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="ci" placeholder="CI" value={usuario.ci} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="telefono" placeholder="Teléfono" value={usuario.telefono} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="text" name="direccion" placeholder="Dirección" value={usuario.direccion} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="antiguedad" placeholder="Antigüedad" value={usuario.antiguedad} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="number" name="columna" placeholder="columna" value={usuario.columna !== null ? usuario.columna : ""} onChange={handleChange} className="w-full p-2 border rounded" required />
        
        <select name="rol" value={usuario.rol} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="ADMIN">Admin</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="FRATERNO">Fraterno</option>
        </select>
        
        <div>
          <label>
            <input type="radio" name="activo" value="true" checked={usuario.activo} onChange={handleRadioChange} /> Activo
          </label>
          <label className="ml-4">
            <input type="radio" name="activo" value="false" checked={!usuario.activo} onChange={handleRadioChange} /> Inactivo
          </label>
        </div>
        
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Guardar Cambios</button>
      </form>
    </div>
  );
}
