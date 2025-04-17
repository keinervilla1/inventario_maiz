<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos'; // Asegura que el nombre de la tabla es correcto

    public $timestamps = true; // Habilita timestamps
    
    protected $fillable = ['nombre', 'peso_kg', 'peso_bulto', 'precio_kg', 'precio_libra', 'precio_bulto', 'stock_bultos', 'fecha_registro'];
}
