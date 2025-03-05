"use client";
import '../styles.css'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../users/usuarios.api";

export default function LoginPage() {
  const [ci, setCi] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        const data = await login(ci, password); // Llamamos a la función centralizada
        localStorage.setItem("token", data.access_token);
        router.push("/principal");
    } catch (err: any) {
        setError(err.message);
    }
};

  return (
    <div className="gradient-background flex flex-col items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="w-96 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="CI"
          value={ci}
          onChange={(e) => setCi(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}
