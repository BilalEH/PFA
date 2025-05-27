<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use Illuminate\Http\Request;

class InterviewController extends Controller
{
    /**
     * Affiche toutes les interviews.
     */
    public function index()
    {
        $interviews = Interview::with(['application', 'interviewer'])->get();
        return response()->json($interviews);
    }

    /**
     * Crée une nouvelle interview.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'application_id' => 'required|exists:applications,id',
            'interviewer_id' => 'required|exists:users,id',
            'scheduled_at'   => 'required|date',
            'location'       => 'nullable|string|max:255',
            'meeting_link'   => 'nullable|string|max:255',
            'status'         => 'required|in:scheduled,completed,canceled,missed',
            'feedback'       => 'nullable|string',
            'rating'         => 'nullable|integer|min:1|max:5',
        ]);

        $interview = Interview::create($validated);
        return response()->json($interview, 201);
    }

    /**
     * Affiche une interview spécifique.
     */
    public function show($id)
    {
        $interview = Interview::with(['application', 'interviewer'])->findOrFail($id);
        return response()->json($interview);
    }

    /**
     * Met à jour une interview.
     */
    public function update(Request $request, $id)
    {
        $interview = Interview::findOrFail($id);

        $validated = $request->validate([
            'scheduled_at'   => 'sometimes|date',
            'location'       => 'nullable|string|max:255',
            'meeting_link'   => 'nullable|string|max:255',
            'status'         => 'sometimes|in:scheduled,completed,canceled,missed',
            'feedback'       => 'nullable|string',
            'rating'         => 'nullable|integer|min:1|max:5',
        ]);

        $interview->update($validated);
        return response()->json($interview);
    }

    /**
     * Supprime une interview.
     */
    public function destroy($id)
    {
        $interview = Interview::findOrFail($id);
        $interview->delete();

        return response()->json(['message' => 'Interview supprimée avec succès.']);
    }
    
}
