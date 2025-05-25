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

    public function getinterViewSlotsList(Club $club)
    {
        // Get all interview slots related to the club
        $interviews = $club->interviewSlots;

        // If there are no interview slots, return an appropriate response
        if ($interviews->isEmpty()) {
            return response()->json(['message' => 'No interview slots found.'], 404);
        }

        // Get the last interview slot
        $lastInterview = $interviews->last();

        $startDate = Carbon::parse($lastInterview->start_time);
        $endDate = Carbon::parse($lastInterview->end_time);
        $now = Carbon::now();

        // Check if now is within the start and end time
        $isOngoing = $now->between($startDate, $endDate);

        // Calculate remaining days if it's ongoing
        $daysLeft = $isOngoing ? $now->diffInDays($endDate, false) : null;

        return response()->json([
            'interviews' => $interviews,
            'lastInterview' => $lastInterview,
            'isOngoing' => $isOngoing,
            'daysLeft' => $daysLeft // this will be null if not ongoing
        ], 200);
    }

    public function getEventsList(Club $club)
    {
        $events = $club->events;
        return response()->json($events);
    }

    public function getApplication(Interview $interview)
    {
        // $applications = $interview->application;
        return response()->json($interview);
    }
}
