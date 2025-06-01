<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Affiche toutes les notifications.
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $notifications = Notification::where('user_id', $user->id)->get();
        return response()->json($notifications);

    }

    public function getNotificationsOfUserNotReadNumber()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $notifications = Notification::where('user_id', $user->id)->where('is_read', false)->count();
        return response()->json(['not_read_number' => $notifications]);
    
    }

    /**
     * Crée une nouvelle notification.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
            'type'    => 'nullable|string|max:100',
            'link'    => 'nullable|string|max:255',
            'is_read' => 'boolean',
        ]);
        $validated['user_id']=Auth()->id();
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

    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->is_read = true;
        $notification->save();

        return response()->json(['message' => 'Notification marquée comme lue.'], 200);
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
