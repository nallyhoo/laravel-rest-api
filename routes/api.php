<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProjectController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('products', ProductController::class);
Route::apiResource('projects', ProjectController::class);

Route::get('/exchange-rate', function () {
    return Illuminate\Support\Facades\Http::get('https://open.er-api.com/v6/latest/USD')->json();
});

Route::get('/weather', function (Illuminate\Http\Request $request) {
    $lat = $request->query('lat');
    $lng = $request->query('lng');
    return Illuminate\Support\Facades\Http::get("https://api.open-meteo.com/v1/forecast?latitude={$lat}&longitude={$lng}&current_weather=true")->json();
});
