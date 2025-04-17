import { usePage } from "@inertiajs/react";
import { useState, FormEvent } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

type HistorialPageProps = {
    historial: {
        data: Array<{
            id: number;
            tipo: string;
            descripcion: string;
            cantidad_vendida?: number | null; // ✅ AÑADIDO
            created_at: string;
            nombre_producto: string | null;
            nombre_usuario: string | null;
        }>;
    };
    filtros: {
        search?: string;
        tipo?: string;
    };
};

export default function HistorialIndex() {
    const { historial, filtros } = usePage<HistorialPageProps>().props;

    const [search, setSearch] = useState(filtros.search || "");
    const [tipo, setTipo] = useState(filtros.tipo || "");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        window.location.href = `/historial?search=${search}&tipo=${tipo}`;
    };
    const breadcrumbs: BreadcrumbItem[] = [{ title: "Historial", href: "/historial" }];

    return (
        <div className="max-w-6xl mx-auto mt-8 px-4">
            <h1 className="text-3xl font-bold mb-6">📚 Historial de Movimientos</h1>

            {/* Filtros */}
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    className="border rounded px-4 py-2 w-full sm:w-64 dark:bg-gray-800"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="border rounded px-4 py-2 w-full sm:w-40 dark:bg-gray-800"
                >
                    <option value="">Todos</option>
                    <option value="creacion">Creación</option>
                    <option value="modificacion">Modificación</option>
                    <option value="eliminacion">Eliminación</option>
                    <option value="venta">Venta</option>
                </select>
                <button
                    type="submit"
                    className="bg-[#5acafc] text-[#083344] px-6 py-2 rounded hover:bg-[#3bbbe9] transition-colors duration-200"
                >
                    Filtrar
                </button>
            </form>

            {/* Botones de exportar */}
            <div className="flex gap-4 mb-6">
                <a
                    href={`/historial/exportar/excel?search=${search}&tipo=${tipo}`}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    📊 Exportar Excel
                </a>
                <a
                    href={`/historial/exportar/pdf?search=${search}&tipo=${tipo}`}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    🧾 Exportar PDF
                </a>
            </div>

            {/* Tabla con scroll vertical */}
            <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded shadow max-h-[500px] overflow-y-auto">
                <table className="min-w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-gray-700">
                            <th className="p-4">Tipo</th>
                            <th className="p-4">Producto</th>
                            <th className="p-4">Descripción</th>
                            <th className="p-4">Cantidad Vendida</th> {/* ✅ NUEVA COLUMNA */}
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historial.data.map((item) => (
                            <tr key={item.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="p-4 capitalize">{item.tipo}</td>
                                <td className="p-4">{item.nombre_producto || 'N/A'}</td>
                                <td className="p-4 text-sm">{item.descripcion}</td>
                                <td className="p-4">{item.cantidad_vendida ?? '—'}</td> {/* ✅ VALOR MOSTRADO */}
                                <td className="p-4">{item.nombre_usuario || 'Sistema'}</td>
                                <td className="p-4">{new Date(item.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

HistorialIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: "Historial", href: "/historial" }]}>
        {page}
    </AppLayout>
);