<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas';

    protected $fillable = [
        'producto_id',
        'cantidad_kg',
        'precio_total',
        'unidad',
        'cantidad_original',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}

//hola