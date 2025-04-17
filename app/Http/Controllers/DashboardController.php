<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Historial;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $hoy = Carbon::now();
        $meses = collect();

        // Generar los últimos 12 meses desde el actual hacia atrás
        for ($i = 11; $i >= 0; $i--) {
            $mes = $hoy->copy()->subMonths($i)->format('Y-m');
            $meses->push($mes);
        }

        $data = $meses->map(function ($mes) {
            $inicioMes = Carbon::parse($mes . '-01')->startOfMonth();
            $finMes = Carbon::parse($mes . '-01')->endOfMonth();

            // 🔹 Total bultos ingresados desde historial (creación o modificación)
            $bultosIngresados = Historial::whereIn('tipo', ['creación', 'modificación'])
                ->whereBetween('created_at', [$inicioMes, $finMes])
                ->get()
                ->sum(function ($historial) {
                    $nuevos = is_array($historial->datos_nuevos)
                        ? $historial->datos_nuevos
                        : json_decode($historial->datos_nuevos, true);

                    $anteriores = is_array($historial->datos_anteriores)
                        ? $historial->datos_anteriores
                        : json_decode($historial->datos_anteriores, true);


                    $nuevosBultos = $nuevos['stock_bultos'] ?? 0;
                    $anterioresBultos = $anteriores['stock_bultos'] ?? 0;

                    return max(0, $nuevosBultos - $anterioresBultos);
                });

            // 🔹 Total bultos vendidos desde ventas
            $bultosVendidos = Venta::whereBetween('ventas.created_at', [$inicioMes, $finMes])
                ->join('productos', 'ventas.producto_id', '=', 'productos.id')
                ->get()
                ->sum(function ($venta) {
                    return $venta->cantidad_kg / $venta->peso_kg;
                });

            return [
                'mes' => $inicioMes->translatedFormat('F'),
                'total_ingresados' => round($bultosIngresados, 2),
                'total_vendidos' => round($bultosVendidos, 2),
            ];
        });

        return Inertia::render('Dashboard', [
            'estadisticas' => $data,
        ]);
    }
}