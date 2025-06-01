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
Route::get('/public-events', [EventController::class,'getpublicEvents']);


Route::middleware('auth:sanctum')->group(function () {
    // ----- interviews
    Route::apiResource('interviews', InterviewController::class);
    Route::get('/getMyClubsEvents', [ProfileController::class, 'getMyClubsEvents']);
    // ----- Clubs
    Route::apiResource('clubs', ClubController::class);
    Route::get('club/{club}', [ClubController::class,'getinterViewSlotsList']);
    Route::get('/userIsInClub', [UserController::class, 'ClubTest']);
    Route::get('/userClubs', [ProfileController::class, 'getUserClubs']);
    // ----- Applications
    Route::apiResource('interview-slots', InterviewSlotController::class);
    Route::get('interview/application/{interview}', [ClubController::class, 'getApplication']);
    Route::post('interview/application/{interview}', [ClubController::class, 'saveApplication']);
    //profiles
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::get('/userApplications', [ProfileController::class, 'getUserAplcations']);
    Route::patch('/profile', [ProfileController::class, 'updateProfile']);
    // ----- Notifications
    Route::get('/user/notifications', [NotificationController::class, 'index']);
    Route::get('/user/notifications/not-read-number', [NotificationController::class, 'getNotificationsOfUserNotReadNumber']);
    Route::patch('/user/notifications/{id}', [NotificationController::class, 'markAsRead']);

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
