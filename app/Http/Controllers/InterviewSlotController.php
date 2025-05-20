<?php

namespace App\Http\Controllers;

use App\Models\InterviewSlot;
use Illuminate\Http\Request;

class InterviewSlotController extends Controller
{
    /**
     * Affiche tous les créneaux d’entretien.
     */
    public function index()
    {
        $slots = InterviewSlot::with('club')->get();
        return response()->json($slots);
    }

    /**
     * Crée un nouveau créneau.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'club_id'          => 'required|exists:clubs,id',
            'start_time'       => 'required|date',
            'end_time'         => 'required|date|after:start_time',
            'max_interviews'   => 'required|integer|min:1',
            'booked_interviews'=> 'nullable|integer|min:0',
            'location'         => 'nullable|string|max:255',
            'is_online'        => 'required|boolean',
        ]);

        $slot = InterviewSlot::create($validated);
        return response()->json($slot, 201);
    }

    /**
     * Affiche un créneau spécifique.
     */
    public function show($id)
    {
        $slot = InterviewSlot::with('club')->findOrFail($id);
        return response()->json($slot);
    }

    /**
     * Met à jour un créneau existant.
     */
    public function update(Request $request, $id)
    {
        $slot = InterviewSlot::findOrFail($id);

        $validated = $request->validate([
            'start_time'        => 'sometimes|date',
            'end_time'          => 'sometimes|date|after:start_time',
            'max_interviews'    => 'sometimes|integer|min:1',
            'booked_interviews' => 'nullable|integer|min:0',
            'location'          => 'nullable|string|max:255',
            'is_online'         => 'sometimes|boolean',
        ]);

        $slot->update($validated);
        return response()->json($slot);
    }

    /**
     * Supprime un créneau.
     */
    public function destroy($id)
    {
        $slot = InterviewSlot::findOrFail($id);
        $slot->delete();

        return response()->json(['message' => 'Créneau supprimé avec succès.']);
    }
}
