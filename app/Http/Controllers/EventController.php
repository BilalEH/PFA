<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    /**
     * Affiche la liste des événements
     */
    public function index()
    {
        $events = Event::with(['club', 'eventUsers', 'feedback'])
            ->latest()
            ->paginate(10);

        return view('events.index', compact('events'));
    }

    /**
     * Affiche le formulaire de création
     */
    public function create()
    {
        $clubs = Club::where('is_active', true)->get();
        return view('events.create', compact('clubs'));
    }

    /**
     * Stocke un nouvel événement
     */
    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());
        
        $event = Event::create($validated + [
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return redirect()->route('events.show', $event)->with('success', 'Événement créé !');
    }

    /**
     * Affiche un événement spécifique
     */
    public function show(Event $event)
    {
        $event->load([
            'club', 
            'eventUsers.user', 
            'feedback.user'
        ]);

        return view('events.show', compact('event'));
    }

    /**
     * Affiche le formulaire d'édition
     */
    public function edit(Event $event)
    {
        $clubs = Club::where('is_active', true)->get();
        return view('events.edit', compact('event', 'clubs'));
    }

    /**
     * Met à jour l'événement
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate($this->validationRules());
        
        $event->update($validated + [
            'updated_at' => now()
        ]);

        return redirect()->route('events.show', $event)->with('success', 'Événement mis à jour !');
    }

    /**
     * Supprime l'événement
     */
    public function destroy(Event $event)
    {
        $event->delete();
        return redirect()->route('events.index')->with('success', 'Événement supprimé !');
    }

    /**
     * Règles de validation communes
     */
    protected function validationRules()
    {
        return [
            'club_id' => 'required|exists:clubs,id',
            'title' => 'required|string|max:19',
            'description' => 'required|string',
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'location' => 'nullable|string|max:19',
            'meeting_link' => 'nullable|url|max:19',
            'cover_image' => 'nullable|string|max:19',
            'max_participants' => 'nullable|integer|min:1',
            'is_public' => 'required|boolean',
            'requires_registration' => 'required|boolean',
        ];
    }

    public function getpublicEvents()
    {
        $events = Event::with([
                'club',
                'eventUsers.user:id,first_name,last_name,profile_image',
                'feedback.user:id,first_name,last_name,profile_image' // Eager load user for feedback
            ])
            ->where('is_public', true)
            ->latest()
            ->get();

        // Add number of users for each event and format feedback users
        $events = $events->map(function ($event) {
            $event->users_count = $event->eventUsers->count();
            $event->users = $event->eventUsers->map(function ($eu) {
                return $eu->user;
            });
            unset($event->eventUsers);

            // Format feedback: replace user_id by nameId and profileImage
            $event->feedback = $event->feedback->map(function ($fb) {
                if ($fb->user) {
                    $fb->nameId = $fb->user->first_name . ' ' . $fb->user->last_name;
                    $fb->profileImage = $fb->user->profile_image;
                } else {
                    $fb->nameId = null;
                    $fb->profileImage = null;
                }
                unset($fb->user_id, $fb->user);
                return $fb;
            });

            return $event;
        });

        return response()->json($events);
    }
}