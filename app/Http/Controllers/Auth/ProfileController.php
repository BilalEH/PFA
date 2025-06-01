<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{

    /**
     * Get the authenticated user's profile.
     */
    public function getProfile(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        return response()->json(['user' => $user]);
    }

    /**
     * Update the authenticated user's profile.
     */
    // public function updateProfile(Request $request)
    // {
    //     $user = Auth::user();
    //     if (!$user) {
    //         return response()->json(['message' => 'Unauthenticated'], 401);
    //     }

    //     $validated = $request->validate([
    //         'first_name'     => 'sometimes|string|max:255',
    //         'last_name'      => 'sometimes|string|max:255',
    //         'email'          => 'sometimes|email|unique:users,email,' . $user->id,
    //         'phone_number'   => 'nullable|string|max:20',
    //         'bio'            => 'nullable|string|max:500',
    //         'profile_image'  => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
    //         'student_id'     => 'nullable|string|max:50',
    //         'major'          => 'nullable|string|max:100',
    //         'year_of_study'  => 'nullable|integer|min:1|max:10',
    //         'user_type'      => 'sometimes|in:student,club_admin,system_admin',
    //     ]);

    //     if ($request->hasFile('profile_image')) {
    //         $file = $request->file('profile_image');
    //         $path = $file->store('profile_images', 'public');
    //         $validated['profile_image'] = $path;
    //     }

    //     $user->update($validated);
    //     return response()->json(['message' => 'Profile updated successfully!', 'user' => $user]);
    // }
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $updated = $user->update($validated);

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone_number' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:500',
            'profile_image' => 'nullable|url', // Validate as URL instead of file
            'student_id' => 'nullable|string|max:50',
            'major' => 'nullable|string|max:100',
            'year_of_study' => 'nullable|integer|min:1|max:10',
            'user_type' => 'sometimes|in:student,club_admin,system_admin',
        ]);

        $user->update($validated);
        return response()->json(['message' => 'Profile updated successfully!', 'user' => $user]);
    }

    public function getUserAplcations()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Eager load the club relationship
        $applications = $user->applications()->with('club')->get();

        return response()->json([
            'applications' => $applications,
            'message' => 'User applications retrieved successfully.'
        ], 200);
    }

    public function getUserClubs()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $clubs = $user->clubUsers()->with('club')->get();

        return response()->json([
            'user' => $user,
            'clubs' => $clubs
        ], 200);
    }

    public function getMyClubsEvents()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Eager load the club relationship
        $clubs = $user->clubUsers()->with('club.events')->get();

        return response()->json([
            'clubs' => $clubs,
            'message' => 'User clubs and events retrieved successfully.'
        ], 200);
    }
}
