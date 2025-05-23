<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClubController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Liste tous les clubs.
     */
    public function index(): JsonResponse
    {
        $clubs = Club::all();

        return response()->json([
            'data' => $clubs,
        ], 200);
    }

    /**
     * Crée un nouveau club.
     * Seul le SYSTEM_ADMIN peut exécuter cette action.
     */
    public function store(Request $request): JsonResponse
    {
        if (Auth::user()->user_type !== 'system_admin') {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $validated = $request->validate([
            'name'            => 'required|string|max:191',
            'description'     => 'nullable|string',
            'rules'           => 'nullable|string',
            'logo'            => 'nullable|string|max:191',
            'cover_image'     => 'nullable|string|max:191',
            'is_active'       => 'boolean',
            'foundation_date' => 'nullable|date',
        ]);

        $club = Club::create($validated);

        return response()->json([
            'message' => 'Club créé',
            'data'    => $club,
        ], 201);
    }

    /**
     * Affiche un club spécifique.
     */
    public function show(Club $club): JsonResponse
    {
        return response()->json([
            'data' => $club,
        ], 200);
    }

    /**
     * Met à jour un club existant.
     * Seul le SYSTEM_ADMIN peut exécuter cette action.
     */
    public function update(Request $request, Club $club): JsonResponse
    {
        if (Auth::user()->user_type !== 'system_admin') {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $validated = $request->validate([
            'name'            => 'sometimes|required|string|max:191',
            'description'     => 'nullable|string',
            'rules'           => 'nullable|string',
            'logo'            => 'nullable|string|max:191',
            'cover_image'     => 'nullable|string|max:191',
            'is_active'       => 'boolean',
            'foundation_date' => 'nullable|date',
        ]);

        $club->update($validated);

        return response()->json([
            'message' => 'Club mis à jour',
            'data'    => $club,
        ], 200);
    }

    /**
     * Supprime un club.
     * Seul le SYSTEM_ADMIN peut exécuter cette action.
     */
    public function destroy(Club $club): JsonResponse
    {
        if (Auth::user()->user_type !== 'system_admin') {
            return response()->json([
                'message' => 'Forbidden',
            ], 403);
        }

        $club->delete();

        return response()->json(null, 204);
    }
}
