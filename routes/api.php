<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\InterviewSlotController;
use App\Http\Controllers\NotificationController;    
use App\Http\Controllers\Auth\ProfileController;

// Route protégée par Sanctum pour récupérer l'utilisateur connecté
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


// Routes RESTful pour les ressources principales
Route::apiResource('users', UserController::class);
Route::apiResource('feedbacks', FeedbackController::class);
Route::apiResource('interviews', InterviewController::class);
Route::apiResource('interview-slots', InterviewSlotController::class);
Route::apiResource('notifications', NotificationController::class);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::patch('/profile', [ProfileController::class, 'update']);
});
