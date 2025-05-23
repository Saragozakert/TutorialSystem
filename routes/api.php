<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentAuthController;
use App\Http\Controllers\TutorController;
use App\Http\Controllers\TutorRequestController;

// Student-Role API //
Route::post('/student/register', [StudentAuthController::class, 'register']);
Route::post('/student/login', [StudentAuthController::class, 'login']);


// Tutor-Role API //
Route::post('/tutor/register', [TutorController::class, 'register']);
Route::post('/tutor/login', [TutorController::class, 'login']);


Route::get('/tutors', [TutorController::class, 'getAllTutors']);

// routes/api.php
Route::post('/tutor-requests', [TutorRequestController::class, 'store']);
Route::get('/tutor-requests', [TutorRequestController::class, 'index']);

Route::get('/tutor-requests', [TutorRequestController::class, 'index']);
Route::post('/tutor-requests', [TutorRequestController::class, 'store']);
Route::put('/tutor-requests/{id}', [TutorRequestController::class, 'update']);

Route::get('/completed-sessions', [TutorRequestController::class, 'getCompletedSessions']);

Route::get('/accepted-sessions', [TutorRequestController::class, 'getAcceptedSessions']);

Route::get('/student-sessions', [TutorRequestController::class, 'getStudentSessions']);

//

Route::post('/sessions/{sessionId}/rate', [TutorRequestController::class, 'rateSession']);
Route::get('/tutor-rating', [TutorRequestController::class, 'getAverageRating']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
