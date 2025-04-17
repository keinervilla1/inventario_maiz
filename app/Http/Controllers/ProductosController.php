<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Historial;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductosController extends Controller
{
    public function index()
    {
        return Inertia::render('productos/index', [
            'productos' => Producto::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'peso_kg' => 'required|numeric',
            'peso_bulto' => 'required|numeric',
            'precio_kg' => 'required|numeric',
            'precio_libra' => 'required|numeric',
            'precio_bulto' => 'required|numeric',
            'stock_bultos' => 'required|integer',
        ]);

        $producto = Producto::create([
            'nombre' => $request->nombre,
            'peso_kg' => $request->peso_kg,
            'peso_bulto' => $request->peso_bulto,
            'precio_kg' => $request->precio_kg,
            'precio_libra' => $request->precio_libra,
            'precio_bulto' => $request->precio_bulto,
            'stock_bultos' => $request->stock_bultos,
            'fecha_registro' => now(),
        ]);

        Historial::create([
            'tipo' => 'creación',
            'producto_id' => $producto->id,
            'nombre_producto' => $producto->nombre,
            'descripcion' => 'Producto creado',
            'datos_anteriores' => null,
            'datos_nuevos' => json_encode($producto->toArray()),
            'user_id' => Auth::id(),
            'nombre_usuario' => Auth::user()?->name ?? 'Sistema',
        ]);

        return redirect()->route('productos.index')->with('success', 'Producto agregado correctamente');
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'nombre' => 'required|string',
            'peso_kg' => 'required|numeric',
            'peso_bulto' => 'required|numeric',
            'precio_kg' => 'required|numeric',
            'precio_libra' => 'required|numeric',
            'precio_bulto' => 'required|numeric',
            'stock_bultos' => 'required|integer',
        ]);

        $producto = Producto::findOrFail($id);
        $datos_anteriores = $producto->toArray();

        $producto->update([
            'nombre' => $request->nombre,
            'peso_kg' => $request->peso_kg,
            'peso_bulto' => $request->peso_bulto,
            'precio_kg' => $request->precio_kg,
            'precio_libra' => $request->precio_libra,
            'precio_bulto' => $request->precio_bulto,
            'stock_bultos' => $request->stock_bultos,
        ]);

        Historial::create([
            'tipo' => 'modificación',
            'producto_id' => $producto->id,
            'nombre_producto' => $producto->nombre,
            'descripcion' => 'Producto actualizado',
            'cantidad_vendida' => null,
            'datos_anteriores' => json_encode($datos_anteriores),
            'datos_nuevos' => json_encode($producto->toArray()),
            'user_id' => Auth::id(),
            'nombre_usuario' => Auth::user()?->name ?? 'Sistema',
        ]);

        return redirect()->route('productos.index')->with('success', 'Producto actualizado correctamente');
    }

    public function destroy(string $id)
    {
        $producto = Producto::findOrFail($id);

        Historial::create([
            'tipo' => 'eliminación',
            'producto_id' => $producto->id,
            'nombre_producto' => $producto->nombre,
            'descripcion' => 'Producto eliminado',
            'cantidad_vendida' => null,
            'datos_anteriores' => json_encode($producto->toArray()),
            'datos_nuevos' => null,
            'user_id' => Auth::id(),
            'nombre_usuario' => Auth::user()?->name ?? 'Sistema',
        ]);

        $producto->delete();

        return redirect()->route('productos.index')->with('success', 'Producto eliminado correctamente.');
    }

    public function agregarStock(Request $request, $id)
    {
        $request->validate([
            'cantidad' => 'required|integer|min:1',
        ]);

        $producto = Producto::findOrFail($id);
        $antes = $producto->toArray();

        $producto->increment('stock_bultos', $request->cantidad);

        Historial::create([
            'tipo' => 'modificación',
            'producto_id' => $producto->id,
            'nombre_producto' => $producto->nombre,
            'descripcion' => 'Se agregó stock',
            'cantidad_vendida' => null,
            'datos_anteriores' => json_encode($antes),
            'datos_nuevos' => json_encode($producto->toArray()),
            'user_id' => Auth::id(),
            'nombre_usuario' => Auth::user()?->name ?? 'Sistema',
        ]);

        return redirect()->back()->with('success', 'Stock actualizado correctamente');
    }
}
