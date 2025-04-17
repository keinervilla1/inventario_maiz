import { useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

const breadcrumbs: BreadcrumbItem[] = [{ title: "Productos", href: "/productos" }];
const lowStockThreshold = 5; // puedes ajustar este valor

type ProductFormData = {
    nombre: string;
    peso_kg: string;
    peso_bulto: string;
    precio_kg: string;
    precio_libra: string;
    precio_bulto: string;
    stock_bultos: string;
};

export default function Productos() {
    const [alertaVisible, setAlertaVisible] = useState(true);
    const { productos = [] } = usePage<{ productos?: any[] }>().props;
    const { delete: destroy } = useForm();
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleEdit = (producto: any) => {
        setEditingProduct(producto);
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            destroy(`/productos/${id}`);
        }
    };

    const hasLowStock = productos.some((producto) => Number(producto.stock_bultos) < lowStockThreshold);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 rounded-xl p-4">
                <Button onClick={() => setIsAdding(true)}style={{ backgroundColor: '#5acafc', color: '#fff' }}>Añadir Producto</Button>

                {/* ALERTA DE BAJO STOCK */}
                {hasLowStock && alertaVisible && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300 font-semibold flex justify-between items-center">
                        <span>⚠️ Atención: Hay productos con bajo stock.</span>
                        <button
                            onClick={() => setAlertaVisible(false)}
                            className="ml-4 px-2 py-1 text-red-500 hover:text-red-700"
                        >
                            ✖
                        </button>
                    </div>
                )}

                <div className="overflow-y-auto max-h-[600px] rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Peso Kg(Uni)</TableHead>
                                <TableHead>Peso bulto</TableHead>
                                <TableHead>Precio Kg(Uni)</TableHead>
                                <TableHead>Precio Libra</TableHead>
                                <TableHead>Precio Bulto</TableHead>
                                <TableHead>Bultos</TableHead>
                                <TableHead>Fecha Registro</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productos.length > 0 ? (
                                productos.map((producto) => {
                                    const isLowStock = Number(producto.stock_bultos) < lowStockThreshold;
                                    return (
                                        <TableRow key={producto.id}>
                                            <TableCell>{producto.id}</TableCell>
                                            <TableCell>{producto.nombre}</TableCell>
                                            <TableCell>{producto.peso_kg} kg</TableCell>
                                            <TableCell>{producto.peso_bulto}</TableCell>
                                            <TableCell>${producto.precio_kg}</TableCell>
                                            <TableCell>${producto.precio_libra}</TableCell>
                                            <TableCell>${producto.precio_bulto}</TableCell>
                                            <TableCell
                                                className={`relative group ${isLowStock ? "bg-red-100 text-red-700 font-semibold rounded-md" : ""
                                                    }`}
                                            >
                                                <span>{producto.stock_bultos}</span>

                                                {/* Tooltip flotante */}
                                                <div className="absolute z-10 bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:flex px-2 py-1 bg-black text-white text-xs rounded-md shadow-md whitespace-nowrap">
                                                    {Number(producto.stock_bultos) * Number(producto.peso_bulto)} kg en total
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(producto.fecha_registro).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleEdit(producto)} className="mr-2">Editar</Button>
                                                <Button onClick={() => handleDelete(producto.id)} variant="destructive">Eliminar</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center">
                                        No hay productos aún.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {editingProduct && (
                <Modal isOpen={true} onClose={() => setEditingProduct(null)}>
                    <EditProductForm producto={editingProduct} onClose={() => setEditingProduct(null)} />
                </Modal>
            )}

            {isAdding && (
                <Modal isOpen={true} onClose={() => setIsAdding(false)}>
                    <AddProductForm onClose={() => setIsAdding(false)} />
                </Modal>
            )}
        </AppLayout>
    );
}

function EditProductForm({ producto, onClose }: { producto: any; onClose: () => void }) {
    const { data, setData, put } = useForm<ProductFormData>({
        nombre: producto.nombre,
        peso_kg: producto.peso_kg,
        peso_bulto: producto.peso_bulto,
        precio_kg: producto.precio_kg,
        precio_libra: producto.precio_libra,
        precio_bulto: producto.precio_bulto,
        stock_bultos: producto.stock_bultos,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

    const validate = () => {
        const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
        for (const key of Object.keys(data) as Array<keyof ProductFormData>) {
            if (data[key] === "") {
                newErrors[key] = "Este campo es obligatorio";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            put(`/productos/${producto.id}`, { onSuccess: () => onClose() });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-2">
            {/* Nombre del producto */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Nombre del producto</label>
                <input
                    type="text"
                    value={data.nombre}
                    onChange={(e) => setData("nombre", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.nombre && <p className="text-red-400 text-xs">{errors.nombre}</p>}
            </div>

            {/* Peso por Unidad (kg) */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Peso Unidad (kg)</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.peso_kg}
                    onChange={(e) => setData("peso_kg", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.peso_kg && <p className="text-red-400 text-xs">{errors.peso_kg}</p>}
            </div>

            {/* Peso por bulto (kg) */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Peso por bulto (kg)</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.peso_bulto}
                    onChange={(e) => setData("peso_bulto", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.peso_bulto && <p className="text-red-400 text-xs">{errors.peso_bulto}</p>}
            </div>

            {/* Precio por kilogramo */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Precio por kilogramo</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.precio_kg}
                    onChange={(e) => setData("precio_kg", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.precio_kg && <p className="text-red-400 text-xs">{errors.precio_kg}</p>}
            </div>

            {/* Precio por libra */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Precio por libra</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.precio_libra}
                    onChange={(e) => setData("precio_libra", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.precio_libra && <p className="text-red-400 text-xs">{errors.precio_libra}</p>}
            </div>

            {/* Precio por bulto */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Precio por bulto</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.precio_bulto}
                    onChange={(e) => setData("precio_bulto", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.precio_bulto && <p className="text-red-400 text-xs">{errors.precio_bulto}</p>}
            </div>

            {/* Stock de bultos */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Cantidad de bultos en stock</label>
                <input
                    type="number"
                    step="1"
                    value={data.stock_bultos}
                    onChange={(e) => setData("stock_bultos", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.stock_bultos && <p className="text-red-400 text-xs">{errors.stock_bultos}</p>}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit">Guardar</Button>
                <Button onClick={onClose} variant="secondary">Cancelar</Button>
            </div>
        </form>
    );
}


function AddProductForm({ onClose }: { onClose: () => void }) {
    const { data, setData, post } = useForm<ProductFormData>({
        nombre: "",
        peso_kg: "",
        peso_bulto: "",
        precio_kg: "",
        precio_libra: "",
        precio_bulto: "",
        stock_bultos: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

    const validate = () => {
        const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
        for (const key of Object.keys(data) as Array<keyof ProductFormData>) {
            if (data[key] === "") {
                newErrors[key] = "Este campo es obligatorio";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            post("/productos", { onSuccess: () => onClose() });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-2">
            {/* Nombre del producto */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Nombre del producto</label>
                <input
                    type="text"
                    value={data.nombre}
                    onChange={(e) => setData("nombre", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.nombre && <p className="text-red-400 text-xs">{errors.nombre}</p>}
            </div>

            {/* Peso por Unidad (kg) */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Peso Unidad (kg)</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.peso_kg}
                    onChange={(e) => setData("peso_kg", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.peso_kg && <p className="text-red-400 text-xs">{errors.peso_kg}</p>}
            </div>

            {/* Peso por bulto (kg) */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Peso por bulto (kg)</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.peso_bulto}
                    onChange={(e) => setData("peso_bulto", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.peso_bulto && <p className="text-red-400 text-xs">{errors.peso_bulto}</p>}
            </div>

            {/* Precio por kilogramo */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Precio por kilogramo</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.precio_kg}
                    onChange={(e) => setData("precio_kg", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.precio_kg && <p className="text-red-400 text-xs">{errors.precio_kg}</p>}
            </div>

            {/* Precio por libra */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Precio por libra</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.precio_libra}
                    onChange={(e) => setData("precio_libra", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.precio_libra && <p className="text-red-400 text-xs">{errors.precio_libra}</p>}
            </div>

            {/* Precio por bulto */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Precio por bulto</label>
                <input
                    type="number"
                    step="0.01"
                    value={data.precio_bulto}
                    onChange={(e) => setData("precio_bulto", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.precio_bulto && <p className="text-red-400 text-xs">{errors.precio_bulto}</p>}
            </div>

            {/* Stock de bultos */}
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">Cantidad de bultos en stock</label>
                <input
                    type="number"
                    step="1"
                    value={data.stock_bultos}
                    onChange={(e) => setData("stock_bultos", e.target.value)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.stock_bultos && <p className="text-red-400 text-xs">{errors.stock_bultos}</p>}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-2">
                <Button type="submit">Agregar</Button>
                <Button onClick={onClose} variant="secondary">Cancelar</Button>
            </div>
        </form>
    );
}


