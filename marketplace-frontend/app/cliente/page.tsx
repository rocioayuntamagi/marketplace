"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

type Pedido = {
  _id: string;
  estado: string;
};

export default function ClientePage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    api("/pedidos/cliente")
      .then((data) => setPedidos(data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tus pedidos</h1>

      {pedidos.length === 0 && <p>No tenés pedidos todavía.</p>}

      {pedidos.map((p) => (
        <div key={p._id} className="border p-3 mb-2 rounded">
          <p><strong>ID:</strong> {p._id}</p>
          <p><strong>Estado:</strong> {p.estado}</p>

          <a href={`/cliente/pedido/${p._id}`}
            className="text-blue-600 underline">
            Ver detalle
          </a>

          <a href="/cliente/nuevo-pedido" className="bg-blue-600 text-white px-4 py-2 rounded inline-block mb-4">
           + Nuevo pedido
           </a>

        </div>
      ))}
    </div>
  );
}
