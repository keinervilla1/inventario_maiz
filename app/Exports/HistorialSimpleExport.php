<?php

namespace App\Exports;

use Spatie\SimpleExcel\SimpleExcelWriter;
use App\Models\Historial;

class HistorialSimpleExport
{
    protected $collection;

    public function __construct($collection)
    {
        $this->collection = $collection;
    }

    public function export(string $path)
    {
        $writer = SimpleExcelWriter::create($path);

        $writer->addHeader([
            'Tipo',
            'Producto',
            'Descripción',
            'Usuario',
            'Fecha',
        ]);

        foreach ($this->collection as $item) {
            $writer->addRow([
                $item->tipo,
                $item->nombre_producto ?? 'N/A',
                $item->descripcion,
                $item->nombre_usuario ?? 'Sistema',
                $item->created_at->format('Y-m-d H:i:s'),
            ]);
        }

        $writer->close();
    }
}
