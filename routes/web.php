<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductosController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HistorialController;
use App\Http\Controllers\VentaController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::resource('productos', ProductosController::class)->middleware(['auth']);

Route::put('/productos/{id}', [ProductoController::class, 'update']);

Route::get('/ventas', function () {
    $productos = \App\Models\Producto::all();
    return Inertia::render('Ventas', ['productos' => $productos]);
});

Route::post('/ventas', [VentaController::class, 'store']);


Route::get('/historial', [HistorialController::class, 'index'])->name('historial.index');
Route::get('/historial/exportar/{formato}', [HistorialController::class, 'exportar']);

// En routes/web.php
Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
