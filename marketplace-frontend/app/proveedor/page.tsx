"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

type Subpedido = {
  _id: string;
  pedidoId: string;
  estado: string;
  productos: { nombre: string; cantidad: number }[];
};

export default function ProveedorPage() {
  const [subpedidos, setSubpedidos] = useState<Subpedido[]>([]);

  const cargarSubpedidos = () => {
    api("/subpedidos/proveedor")
      .then((data: Subpedido[]) => setSubpedidos(data))
      .catch(() => {});
  };

  useEffect(() => {
    cargarSubpedidos();
  }, []);

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    await api(`/subpedidos/${id}/estado`, {
      method: "PUT",
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    cargarSubpedidos();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel del proveedor</h1>

      {subpedidos.length === 0 && <p>No tenés subpedidos asignados.</p>}

      {subpedidos.map((s) => (
        <div key={s._id} className="border p-4 mb-4 rounded">
          <p><strong>Subpedido:</strong> {s._id}</p>
          <p><strong>Pedido padre:</strong> {s.pedidoId}</p>
          <p><strong>Estado:</strong> {s.estado}</p>

          <h3 className="font-semibold mt-2">Productos</h3>
          {s.productos.map((p, i) => (
            <p key={i}>
              {p.nombre} — {p.cantidad}
            </p>
          ))}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => cambiarEstado(s._id, "aceptado")}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Aceptar
            </button>

            <button
              onClick={() => cambiarEstado(s._id, "preparando")}
              className="bg-yellow-600 text-white px-3 py-1 rounded"
            >
              Preparando
            </button>

            <button
              onClick={() => cambiarEstado(s._id, "enviado")}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Enviado
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
