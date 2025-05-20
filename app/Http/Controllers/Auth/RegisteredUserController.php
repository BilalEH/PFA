<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'student_id' => ['required', 'string', 'max:255', 'unique:users,student_id'],
            'year_of_study' => ['required', 'string', 'in:1st Year,2nd Year,3rd Year,4th Year,5th Year'],
            'branch' => ['required', 'string', 'in:Computer Science,Business Intelligence,Electronics,Civil Engineering,Management,Marketing'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_type' => ['required', 'string', 'in:student'],
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'student_id' => $validated['student_id'],
            'year_of_study' => $validated['year_of_study'],
            'branch' => $validated['branch'],
            'password' => Hash::make($validated['password']),
            'user_type' => $validated['user_type'],
        ]);

        event(new Registered($user));
        $user->sendEmailVerificationNotification();

        Auth::login($user);
        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
        ], 201);
    }
}