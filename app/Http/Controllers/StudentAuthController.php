<?php

namespace App\Http\Controllers;

use App\Models\StudentRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentAuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'username' => 'required|unique:student_roles',
            'password' => 'required',
            'age' => 'required|integer',
            'course' => 'required',
            'email' => 'required|email|unique:student_roles',
            'goal' => 'nullable',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        StudentRole::create($validated);

        return response()->json(['message' => 'Registration successful'], 201);
    }

    public function login(Request $request)
    {
        $student = StudentRole::where('username', $request->username)->first();

        if (!$student || !Hash::check($request->password, $student->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['message' => 'Login successful', 'student' => $student], 200);
    }
}
