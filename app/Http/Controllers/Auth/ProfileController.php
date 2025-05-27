<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'user' => Auth::user(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = Auth::user();


        $validated = $request->validate([
            'phone_number' => ['nullable', 'string', 'max:20'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'profile_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'branch' => ['nullable', 'string', 'max:255'],
            'year_of_study' => ['nullable', 'string', 'max:255'],
        ]);


        if ($request->hasFile('profile_image')) {
            if ($user->profile_image) {
                Storage::disk('public')->delete($user->profile_image);
            }
            $path = $request->file('profile_image')->store('profile_images', 'public');
            $validated['profile_image'] = $path;
        }
        $updated = $user->update($validated);

        if (!$updated) {
            return response()->json(['message' => 'Failed to update profile'], 500);
        }


        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
        ]);
    }
}
