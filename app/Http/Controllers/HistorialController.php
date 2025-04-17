<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Historial;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\HistorialSimpleExport;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class HistorialController extends Controller
{
    // Mostrar la vista del historial con filtros
    public function index(Request $request)
    {
        $filtros = $request->only(['search', 'tipo']);

        $query = Historial::query()
            ->when($filtros['search'] ?? null, fn($q, $search) =>
                $q->where('nombre_producto', 'like', "%{$search}%")
            )
            ->when($filtros['tipo'] ?? null, fn($q, $tipo) =>
                $q->where('tipo', $tipo)
            )
            ->orderByDesc('created_at');

        $historial = $query->paginate(30)->withQueryString();

        // Transformar los datos para incluir cantidad_vendida
        $historial->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'tipo' => $item->tipo,
                'descripcion' => $item->descripcion,
                'cantidad_vendida' => $item->cantidad_vendida, // ✅ AÑADIDO AQUÍ
                'created_at' => $item->created_at,
                'nombre_producto' => $item->nombre_producto,
                'nombre_usuario' => $item->nombre_usuario,
                'created_at' => now(), // Laravel lo hace automático si usas timestamps
            ];
        });

        return Inertia::render('Historial', [
            'historial' => $historial,
            'filtros' => $filtros,
        ]);
    }

    // Exportar historial filtrado a Excel o PDF
    public function exportar(Request $request, $formato)
    {
        $filtros = $request->only(['search', 'tipo']);

        $historial = Historial::query()
            ->when($filtros['search'] ?? null, fn($q, $search) =>
                $q->where('nombre_producto', 'like', "%{$search}%")
            )
            ->when($filtros['tipo'] ?? null, fn($q, $tipo) =>
                $q->where('tipo', $tipo)
            )
            ->orderByDesc('created_at')
            ->get();

        if ($formato === 'excel') {
            $exportador = new HistorialSimpleExport($historial);
            $filePath = storage_path('app/public/historial.xlsx');

            $exportador->export($filePath);

            return response()->download($filePath)->deleteFileAfterSend(true);
        }

        if ($formato === 'pdf') {
            $pdf = Pdf::loadView('pdf.historial', ['historial' => $historial]);
            return $pdf->download('historial.pdf');
        }

        return back()->withErrors(['formato' => 'Formato no válido']);
    }
}
