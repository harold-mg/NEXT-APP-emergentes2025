"use client";
import '../styles.css'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VerUsuarios from "../users/ver-usuarios/page";
import AsignarLugares from "../lugares/page";
import ColumnaAdmin from "../lugares/[id]/page";
import Columnas from "../lugares/[id]/page";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { getUsuario } from "../users/usuarios.api"; // Asegúrate de que esta función esté correctamente definida

export default function Principal() {
  const router = useRouter();
  const [usuarioRol, setUsuarioRol] = useState<string | null>(null); // Guardamos el rol del usuario

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login"); // Redirigir si no hay token
      return;
    }

    // Función para decodificar el JWT
    const decodeJWT = (token: string) => {
      const base64Url = token.split('.')[1]; // Obtener la parte del payload
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convertir Base64Url a Base64 estándar
      const decodedData = JSON.parse(atob(base64)); // Decodificar y parsear el JSON
      return decodedData;
    };

    const decodedToken = decodeJWT(token);
    console.log("Token decodificado:", decodedToken);

    // Llamar a la API para obtener los detalles del usuario usando el 'sub' (ID)
    const fetchUser = async () => {
      const user = await getUsuario(decodedToken.sub); // Usamos el sub (ID del usuario)
      setUsuarioRol(user.rol); // Guardamos el rol del usuario
    };

    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className="gradient-background flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a Principal</h1>

        {/* Solo mostrar el botón si el rol es ADMIN */}
        {usuarioRol === "ADMIN" && (
          <Link href="/users/nuevo">
            <button className="w-full bg-blue-500 text-white p-2 rounded mb-4">
              Agregar Nuevo Usuario
            </button>
          </Link>
        )}


        {/* Mostrar la lista de usuarios solo si el rol es ADMIN */}
        {usuarioRol === "ADMIN" ? (
          <VerUsuarios />
        ) : (
          <p>FRATERNO.</p>
        )}
        {/* Solo mostrar las columnas y la asignación de lugares si el rol es ADMIN */}
        {usuarioRol === "ADMIN" && (
          <>
            <Columnas />
            <AsignarLugares />
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
