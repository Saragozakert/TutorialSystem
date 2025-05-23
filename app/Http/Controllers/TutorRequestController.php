<?php

namespace App\Http\Controllers;

use App\Models\TutorRequest;
use Illuminate\Http\Request;

class TutorRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tutor_id' => 'required|exists:tutors,id',
            'student_id' => 'required|exists:student_roles,id',
            'subject' => 'required|string',
            'schedule' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        $tutorRequest = TutorRequest::create([
            'student_id' => $validated['student_id'],
            'tutor_id' => $validated['tutor_id'],
            'subject' => $validated['subject'],
            'schedule' => $validated['schedule'],
            'notes' => $validated['notes'],
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Request sent successfully',
            'request' => $tutorRequest->load('tutor')
        ], 201);
    }

    public function index(Request $request)
    {
        $query = TutorRequest::with(['tutor', 'student'])
            ->where('status', 'pending'); // Only get pending requests by default

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('tutor_id')) {
            $query->where('tutor_id', $request->tutor_id);
        }

        $requests = $query->orderBy('created_at', 'desc')->get();

        return response()->json($requests);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,accepted,declined,completed,cancelled,rated'
        ]);

        $tutorRequest = TutorRequest::findOrFail($id);
        $tutorRequest->update($validated);

        return response()->json([
            'message' => 'Request updated successfully',
            'request' => $tutorRequest->load(['tutor', 'student'])
        ]);
    }

    public function getCompletedSessions(Request $request)
    {
        $query = TutorRequest::with(['student'])
            ->where('status', 'completed')
            ->where('tutor_id', $request->tutor_id);

        $sessions = $query->orderBy('schedule', 'desc')->get();

        return response()->json($sessions);
    }


    public function getAcceptedSessions(Request $request)
    {
        $query = TutorRequest::with(['student'])
            ->where('status', 'accepted')
            ->where('tutor_id', $request->tutor_id);

        $sessions = $query->orderBy('schedule', 'asc')->get();

        return response()->json($sessions);
    }

    //

    public function getStudentSessions(Request $request)
    {
        $query = TutorRequest::with(['tutor' => function ($query) {
            $query->select('id', 'full_name'); // Changed to use full_name
        }])
            ->where('student_id', $request->student_id)
            ->whereIn('status', ['accepted', 'completed']);

        $sessions = $query->orderBy('schedule', 'desc')->get();

        return response()->json($sessions);
    }


    // Add this to your TutorRequestController.php
    public function rateSession(Request $request, $sessionId)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string'
        ]);

        $tutorRequest = TutorRequest::findOrFail($sessionId);

        // Update the session with rating and feedback
        $tutorRequest->update([
            'rating' => $validated['rating'],
            'feedback' => $validated['feedback'],
            'status' => 'rated'
        ]);

        return response()->json([
            'message' => 'Session rated successfully',
            'session' => $tutorRequest
        ]);
    }

    public function getAverageRating(Request $request)
    {
        $validated = $request->validate([
            'tutor_id' => 'required|exists:tutors,id'
        ]);

        $averageRating = TutorRequest::where('tutor_id', $validated['tutor_id'])
            ->whereNotNull('rating')
            ->avg('rating');

        $totalRatings = TutorRequest::where('tutor_id', $validated['tutor_id'])
            ->whereNotNull('rating')
            ->count();

        return response()->json([
            'average_rating' => round($averageRating, 1) ?? 0,
            'total_ratings' => $totalRatings
        ]);
    }
}
