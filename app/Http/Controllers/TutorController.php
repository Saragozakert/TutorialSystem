<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tutor;
use Illuminate\Support\Facades\Hash;

class TutorController extends Controller
{
    public function register(Request $request)
{
    $request->validate([
        'full_name' => 'required',
        'email' => 'required|email|unique:tutors',
        'username' => 'required|unique:tutors',
        'password' => 'required',
    ]);

    $tutor = Tutor::create([
        ...$request->except('password'),
        'password' => Hash::make($request->password),
    ]);

    return response()->json([
        'message' => 'Tutor registered successfully',
        'tutor' => $tutor // Make sure to return the tutor object
    ], 201);
}

    public function login(Request $request)
    {
        $tutor = Tutor::where('username', $request->username)->first();

        if (!$tutor || !Hash::check($request->password, $tutor->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'tutor' => $tutor,
        ]);
    }

    public function getAllTutors()
    {
        $tutors = Tutor::all();
        return response()->json($tutors);
    }
}
