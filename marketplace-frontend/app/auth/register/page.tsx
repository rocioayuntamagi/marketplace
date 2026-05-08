"use client";

import { useState } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("cliente");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api("/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre, email, password, rol })
});
      router.push("/auth/login");

    } catch (err) {
      setError("Error al registrarse");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleRegister} className="p-6 bg-white shadow rounded w-80">
        <h1 className="text-xl font-bold mb-4">Crear cuenta</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Nombre"
          className="border p-2 w-full mb-3"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-3"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="cliente">Cliente</option>
          <option value="proveedor">Proveedor</option>
        </select>

        <button className="bg-green-600 text-white w-full py-2 rounded">
          Registrarse
        </button>
      </form>
    </div>
  );
}
