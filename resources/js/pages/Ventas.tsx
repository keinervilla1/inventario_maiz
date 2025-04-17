import { usePage, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Ventas() {
    const { productos = [] } = usePage<{ productos: any[] }>().props;

    const { data, setData, post, errors } = useForm({
        producto_id: "",
        unidad: "kg",
        cantidad: "",
    });

    const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        post("/ventas", {
            onSuccess: () => {
                setData({
                    producto_id: "",
                    unidad: "kg",
                    cantidad: "",
                });
            },
        });
    };

    const hoveredProduct = productos.find((p) => p.id == hoveredProductId);

    const getTotalKg = (producto: any) => {
        return (producto.stock_bultos * producto.peso_bulto).toFixed(2);
    };

    return (
        <AppLayout breadcrumbs={[{ title: "Ventas", href: "/ventas" }]}>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-md shadow-md w-full max-w-3xl mx-auto mt-10 flex flex-col gap-6"
            >
                <h2 className="text-3xl font-bold mb-4">💸 Registrar Venta</h2>

                {/* Producto */}
                <div className="flex flex-col gap-1 relative w-full">
                    <label className="font-semibold text-sm">Producto</label>
                    <select
                        value={data.producto_id}
                        onChange={(e) => setData("producto_id", e.target.value)}
                        onMouseOver={(e) => setHoveredProductId((e.target as HTMLSelectElement).value)}
                        onMouseOut={() => setHoveredProductId(null)}
                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Selecciona</option>
                        {productos.map((producto) => {
                            const totalKg = getTotalKg(producto);
                            return (
                                <option key={producto.id} value={producto.id}>
                                    {producto.nombre} ({totalKg} kg disponibles)
                                </option>
                            );
                        })}
                    </select>

                    {hoveredProduct && (
                        <div className="absolute top-full left-0 mt-2 bg-gray-100 border p-3 rounded shadow w-full z-10 text-sm">
                            <p><strong>Nombre:</strong> {hoveredProduct.nombre}</p>
                            <p><strong>Peso por Bulto:</strong> {hoveredProduct.peso_kg} kg</p>
                            <p><strong>Stock en Bultos:</strong> {hoveredProduct.stock_bultos.toFixed(2)}</p>
                            <p><strong>Total Disponible (kg):</strong> {getTotalKg(hoveredProduct)} kg</p>
                            <p><strong>Precio por Kg:</strong> ${hoveredProduct.precio_kg}</p>
                            <p><strong>Precio por Libra:</strong> ${hoveredProduct.precio_libra}</p>
                        </div>
                    )}
                </div>

                {/* Cantidad */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="font-semibold text-sm">Cantidad</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.cantidad}
                        onChange={(e) => setData("cantidad", e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.cantidad && <p className="text-red-400 text-xs">{errors.cantidad}</p>}
                </div>

                {/* Unidad */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="font-semibold text-sm">Unidad</label>
                    <select
                        value={data.unidad}
                        onChange={(e) => setData("unidad", e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="kg">Kilos</option>
                        <option value="libra">Libras</option>
                    </select>
                </div>

                {/* Botón */}
                <div className="flex justify-end pt-2">
                    <Button type="submit" style={{ backgroundColor: '#5acafc', color: '#fff' }}>Registrar Venta</Button>
                </div>
            </form>
        </AppLayout>
    );
}
