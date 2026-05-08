"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

type Subpedido = {
  _id: string;
  proveedor: string;
  estado: string;
};

type Pedido = {
  _id: string;
  estado: string;
  cliente: string;
  subpedidos: Subpedido[];
};

export default function AdminPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState("todos");

  const cargarPedidos = () => {
    api("/pedidos")
      .then((data: Pedido[]) => setPedidos(data))
      .catch(() => {});
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const pedidosFiltrados =
    filtro === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtro);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel del administrador</h1>

      {/* Filtros */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setFiltro("todos")}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          Todos
        </button>

        <button
          onClick={() => setFiltro("pendiente")}
          className="bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Pendientes
        </button>

        <button
          onClick={() => setFiltro("completado")}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Completados
        </button>
      </div>

      {/* Listado */}
      {pedidosFiltrados.map((p) => (
        <div key={p._id} className="border p-4 mb-4 rounded">
          <p><strong>Pedido:</strong> {p._id}</p>
          <p><strong>Cliente:</strong> {p.cliente}</p>
          <p><strong>Estado:</strong> {p.estado}</p>

          <h3 className="font-semibold mt-3">Subpedidos</h3>

          {p.subpedidos.map((s) => (
            <div key={s._id} className="border p-2 mt-2 rounded">
              <p><strong>ID:</strong> {s._id}</p>
              <p><strong>Proveedor:</strong> {s.proveedor}</p>
              <p><strong>Estado:</strong> {s.estado}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
