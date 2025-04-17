import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: any) => void;
    product?: any;
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
    const [formData, setFormData] = useState({
        nombre: "",
        peso_kg: "",
        precio_kg: "",
        precio_libra: "",
        stock_bultos: "",
    });

    useEffect(() => {
        if (product) setFormData(product);
        else setFormData({ nombre: "", peso_kg: "", precio_kg: "", precio_libra: "", stock_bultos: "" });
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <Input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
                    <Input name="peso_kg" placeholder="Peso (kg)" type="number" value={formData.peso_kg} onChange={handleChange} />
                    <Input name="precio_kg" placeholder="Precio x Kg" type="number" value={formData.precio_kg} onChange={handleChange} />
                    <Input name="precio_libra" placeholder="Precio x Libra" type="number" value={formData.precio_libra} onChange={handleChange} />
                    <Input name="stock_bultos" placeholder="Stock de bultos" type="number" value={formData.stock_bultos} onChange={handleChange} />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}>{product ? "Actualizar" : "Agregar"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
