"use client";

import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { useParams } from "next/navigation";

type Pedido = {
  _id: string;
  estado: string;
  productos: { nombre: string; cantidad: number }[];
};

export default function PedidoDetalle() {
  const { id } = useParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    api(`/pedidos/seguimiento/${id}`)
      .then((data) => setPedido(data))
      .catch(() => {});
  }, [id]);

  if (!pedido) return <p className="p-6">Cargando pedido...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pedido {pedido._id}</h1>

      <p className="mb-4">
        <strong>Estado:</strong> {pedido.estado}
      </p>

      <h2 className="text-xl font-semibold mb-2">Productos</h2>

      {pedido.productos.map((prod, i) => (
        <div key={i} className="border p-3 mb-2 rounded">
          <p><strong>{prod.nombre}</strong></p>
          <p>Cantidad: {prod.cantidad}</p>
        </div>
      ))}
    </div>
  );
}
