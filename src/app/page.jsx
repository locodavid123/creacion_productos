"use client";

import Image from "next/image";

import { useState, useEffect } from "react";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState(null);

  // Función para obtener los productos de la API
const fetchProducts = async () => {
    try {
        setLoading(true);
        const res = await fetch("/api/products");
        if (!res.ok) {
            throw new Error("Error al cargar los productos.");
        }
        const data = await res.json();
        setProducts(data);
        setError(null);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

  // Cargar los productos cuando el componente se monta
useEffect(() => {
    fetchProducts();
}, []);

  // Manejar el envío del formulario para crear un nuevo producto
const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al crear el producto.");
      }

      // Limpiar el formulario y recargar la lista de productos
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      await fetchProducts(); // Recargar para mostrar el nuevo producto
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <main className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Gestión de Productos
        </h1>

        {/* Formulario para crear productos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Añadir Nuevo Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium">Descripción</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium">Precio</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium">Stock</label>
                <input type="number" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
            </div>
            {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Crear Producto
            </button>
          </form>
        </div>

        {/* Lista de productos */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-center">
            Lista de Productos
          </h2>
          {loading && <p className="text-center">Cargando productos...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description || "Sin descripción"}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-indigo-500">${parseFloat(product.price).toFixed(2)}</p>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No hay productos para mostrar. ¡Añade uno nuevo!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
