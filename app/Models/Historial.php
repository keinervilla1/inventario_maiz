<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Historial extends Model
{
    protected $table = 'historial_movimientos';

    protected $fillable = [
        'tipo',
        'producto_id',
        'nombre_producto',  // Nueva columna
        'descripcion',
        'cantidad_vendida', // ✅ asegúrate de tener esto
        'datos_anteriores',
        'datos_nuevos',
        'user_id',
        'nombre_usuario',   // Nueva columna

    ];

    protected $casts = [
        'datos_anteriores' => 'array',
        'datos_nuevos' => 'array',
    ];

    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
