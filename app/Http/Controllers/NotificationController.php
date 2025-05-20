<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Affiche toutes les notifications.
     */
    public function index()
    {
        $notifications = Notification::with('user')->get();
        return response()->json($notifications);
    }

    /**
     * Crée une nouvelle notification.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
            'type'    => 'nullable|string|max:100',
            'link'    => 'nullable|string|max:255',
            'is_read' => 'boolean',
        ]);

        $notification = Notification::create($validated);
        return response()->json($notification, 201);
    }

    /**
     * Affiche une notification spécifique.
     */
    public function show($id)
    {
        $notification = Notification::with('user')->findOrFail($id);
        return response()->json($notification);
    }

    /**
     * Met à jour une notification (ex: marquer comme lue).
     */
    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);

        $validated = $request->validate([
            'title'   => 'sometimes|string|max:255',
            'message' => 'sometimes|string',
            'type'    => 'nullable|string|max:100',
            'link'    => 'nullable|string|max:255',
            'is_read' => 'sometimes|boolean',
        ]);

        $notification->update($validated);
        return response()->json($notification);
    }

    /**
     * Supprime une notification.
     */
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();

        return response()->json(['message' => 'Notification supprimée avec succès.']);
    }
}
