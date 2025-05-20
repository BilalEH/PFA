<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Affiche tous les utilisateurs.
     */
    public function index()
    {
        $users = User::with([
            'applications',
            'clubUsers',
            'eventUsers',
            'feedback',
            'interviews',
            'notifications'
        ])->get();

        return response()->json($users);
    }

    /**
     * Crée un nouvel utilisateur.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'     => 'required|string|max:255',
            'last_name'      => 'required|string|max:255',
            'email'          => 'required|email|unique:users,email',
            'password'       => 'required|string|min:6',
            'user_type'      => 'required|in:student,club_admin,system_admin',
            'profile_image'  => 'nullable|string',
            'student_id'     => 'nullable|string|max:50',
            'major'          => 'nullable|string|max:100',
            'year_of_study'  => 'nullable|integer|min:1|max:10',
            'phone_number'   => 'nullable|string|max:20',
            'bio'            => 'nullable|string|max:500',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);
        return response()->json($user, 201);
    }

    /**
     * Affiche un utilisateur spécifique.
     */
    public function show($id)
    {
        $user = User::with([
            'applications',
            'clubUsers',
            'eventUsers',
            'feedback',
            'interviews',
            'notifications'
        ])->findOrFail($id);

        return response()->json($user);
    }

    /**
     * Met à jour les infos d’un utilisateur.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name'     => 'sometimes|string|max:255',
            'last_name'      => 'sometimes|string|max:255',
            'email'          => 'sometimes|email|unique:users,email,' . $user->id,
            'password'       => 'nullable|string|min:6',
            'user_type'      => 'sometimes|in:student,club_admin,system_admin',
            'profile_image'  => 'nullable|string',
            'student_id'     => 'nullable|string|max:50',
            'major'          => 'nullable|string|max:100',
            'year_of_study'  => 'nullable|integer|min:1|max:10',
            'phone_number'   => 'nullable|string|max:20',
            'bio'            => 'nullable|string|max:500',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        return response()->json($user);
    }

    /**
     * Supprime un utilisateur.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès.']);
    }
}
