<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\Historial;
use Illuminate\Support\Facades\Auth;

class VentaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'unidad' => 'required|in:kg,libra',
            'cantidad' => 'required|numeric|min:0.01',
        ]);

        $producto = Producto::findOrFail($request->producto_id);
        $cantidadVendida = $request->cantidad; // ✅ Aquí capturas la cantidad
        $datos_anteriores = $producto->toArray();

        // Convertir a kilos si es libra
        $cantidad_kg = $request->unidad === 'libra'
            ? $cantidadVendida * 0.453592
            : $cantidadVendida;

        // Total de kilos disponibles
        $total_kg_disponibles = $producto->stock_bultos * $producto->peso_bulto;

        if ($cantidad_kg > $total_kg_disponibles) {
            return back()->withErrors(['cantidad' => 'No hay suficiente stock disponible.']);
        }

        // Nuevo total de kilos
        $nuevo_stock_kg = $total_kg_disponibles - $cantidad_kg;

        // Nuevo total de bultos
        $nuevo_stock_bultos = $nuevo_stock_kg / $producto->peso_bulto;

        // Actualizar el stock (con precisión)
        $producto->stock_bultos = round($nuevo_stock_bultos, 4);
        $producto->stock_kg = round($nuevo_stock_kg, 2); // ✅ Actualiza también el campo en kilos si lo tienes
        $producto->save();

        // Calcular precio total
        $precio_total = $request->unidad === 'libra'
            ? $producto->precio_libra * $cantidadVendida
            : $producto->precio_kg * $cantidadVendida;

        // Registrar la venta
        Venta::create([
            'producto_id' => $producto->id,
            'cantidad_kg' => $cantidad_kg,
            'precio_total' => $precio_total,
            'unidad' => $request->unidad,
            'cantidad_original' => $cantidadVendida,
        ]);

        // Registrar en historial_movimientos
        Historial::create([
            'tipo' => 'venta',
            'producto_id' => $producto->id,
            'nombre_producto' => $producto->nombre,
            'descripcion' => 'Se realizó una venta',
            'cantidad_vendida' => $cantidadVendida, // ✅ Variable correcta aquí
            'datos_anteriores' => json_encode($datos_anteriores),
            'datos_nuevos' => json_encode($producto->toArray()),
            'user_id' => Auth::id(),
            'nombre_usuario' => Auth::user()?->name ?? 'Sistema',
        ]);

        return redirect()->back()->with('success', '✅ Venta registrada exitosamente.');
    }
}
