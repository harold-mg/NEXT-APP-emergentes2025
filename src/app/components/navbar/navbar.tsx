"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Navbar() {
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem("token"); // Eliminar token
        localStorage.removeItem("user");  // Eliminar usuario
        router.push("/login");            // Redirigir al login
        };
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Fraternidad</h1>
      <div className="space-x-4">
        <Link href="/principal" className="hover:underline">Inicio</Link>
        <Link href="/users/ver-usuarios" className="hover:underline">Usuarios</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
