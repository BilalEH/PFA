<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClubController; 
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\InterviewSlotController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\test;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\EventController;

// Route protégée par Sanctum pour récupérer l'utilisateur connecté
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('users', UserController::class);
Route::get('feedbacks', [FeedbackController::class,"index"]);
Route::apiResource('interviews', InterviewController::class);
Route::apiResource('interview-slots', InterviewSlotController::class);
Route::apiResource('notifications', NotificationController::class);
Route::apiResource('clubs', ClubController::class);
Route::get('/public-events', [EventController::class,'getpublicEvents']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('club/{club}', [ClubController::class,'getinterViewSlotsList']);
    Route::get('interview/application/{interview}', [ClubController::class, 'getApplication']);
    Route::post('interview/application/{interview}', [ClubController::class, 'saveApplication']);
    Route::patch('interview', [ClubController::class, 'test']);
    Route::get('/userIsInClub', [UserController::class, 'ClubTest']);
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::get('/userApplications', [ProfileController::class, 'getUserAplcations']);
    Route::patch('/profile', [ProfileController::class, 'updateProfile']);
});






// // -------------
//     // Clubs
//     // Route::get('/clubs', [test::class, 'getClubs']);
//     Route::post('/apply-club', [test::class, 'applyToClub']);
    
//     // Interviews
//     Route::get('/candidature/{candidature}/interviews', [test::class, 'getAvailableInterviews']);
//     Route::post('/book-interview', [test::class, 'bookInterview']);
    
//     // Dashboard
//     Route::get('/dashboard/{userId}', [test::class, 'getDashboard']);
