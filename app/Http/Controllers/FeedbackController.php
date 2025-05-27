<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * Affiche la liste des feedbacks.
     */
    public function index()
    {
        $feedbacks = Feedback::with(['user', 'event'])->get();
        return response()->json($feedbacks);
    }

    /**
     * Crée un nouveau feedback.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'user_id' => 'required|exists:users,id',
            'rating'   => 'required|integer|min:1|max:5',
            'comment'  => 'nullable|string',
        ]);

        $feedback = Feedback::create($validated);
        return response()->json($feedback, 201);
    }

    /**
     * Affiche un feedback spécifique.
     */
    public function show($id)
    {
        $feedback = Feedback::with(['user', 'event'])->findOrFail($id);
        return response()->json($feedback);
    }

    /**
     * Met à jour un feedback existant.
     */
    public function update(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);

        $validated = $request->validate([
            'rating'   => 'sometimes|integer|min:1|max:5',
            'comment'  => 'nullable|string',
        ]);

        $feedback->update($validated);
        return response()->json($feedback);
    }

    /**
     * Supprime un feedback.
     */
    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();

        return response()->json(['message' => 'Feedback supprimé avec succès.']);
    }
}