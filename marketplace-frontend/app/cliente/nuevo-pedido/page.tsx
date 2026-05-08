"use client";

import { useState } from "react";
import { api } from "../../services/api";
import { useRouter } from "next/navigation";

export default function NuevoPedido() {
  const router = useRouter();

  const [productos, setProductos] = useState([
    { nombre: "", cantidad: 1 },
  ]);

  const agregarProducto = () => {
    setProductos([...productos, { nombre: "", cantidad: 1 }]);
  };

  const actualizarProducto = (index: number, campo: string, valor: any) => {
    const copia = [...productos];
    (copia[index] as any)[campo] = valor;
    setProductos(copia);
  };

  const enviarPedido = async () => {
    try {
      await api("/pedidos", {
        method: "POST",
        body: JSON.stringify({ productos }),
      });

      router.push("/cliente");
    } catch (error) {
      console.log("Error al crear pedido", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crear nuevo pedido</h1>

      {productos.map((prod, i) => (
        <div key={i} className="border p-3 mb-3 rounded">
          <input
            type="text"
            placeholder="Nombre del producto"
            className="border p-2 w-full mb-2"
            value={prod.nombre}
            onChange={(e) => actualizarProducto(i, "nombre", e.target.value)}
          />

          <input
            type="number"
            min="1"
            className="border p-2 w-full"
            value={prod.cantidad}
            onChange={(e) =>
              actualizarProducto(i, "cantidad", Number(e.target.value))
            }
          />
        </div>
      ))}

      <button
        onClick={agregarProducto}
        className="bg-gray-600 text-white px-4 py-2 rounded mr-3"
      >
        + Agregar producto
      </button>

      <button
        onClick={enviarPedido}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Crear pedido
      </button>
    </div>
  );
}
