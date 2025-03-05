"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUsuario } from "@/app/users/usuarios.api";
import Navbar from '../../components/navbar/navbar';
import Footer from "@/app/components/footer/footer";

export default function NuevoUsuario() {
  const router = useRouter();

  const [usuario, setUsuario] = useState({
    nombres: "",
    apellidoP: "",
    apellidoM: "",
    ci: "",
    telefono: "",
    direccion: "",
    password: "",
    rol: "FRATERNO",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usuarioData = { ...usuario, activo: true };
    console.log("Datos enviados:", usuarioData);
    await createUsuario(usuarioData);
    router.push("/principal");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);
  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombres"
          placeholder="Nombre"
          value={usuario.nombres}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="apellidoP"
          placeholder="Apellido Paterno"
          value={usuario.apellidoP}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="apellidoM"
          placeholder="Apellido Materno"
          value={usuario.apellidoM}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="ci"
          placeholder="CI"
          value={usuario.ci}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={usuario.telefono}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={usuario.direccion}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={usuario.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <select
          name="rol"
          value={usuario.rol}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="ADMIN">Admin</option>
          <option value="INSTRUCTOR">Instructor</option>
          <option value="FRATERNO">Fraterno</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Guardar Usuario
        </button>
      </form>
      </div>
      <Footer />
    </>
  );
}